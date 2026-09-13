-- CAR ONE PLUS — schéma Postgres (Supabase)
-- Reflète 05_MODELE_DONNEES_API.md, 07_MODELE_ECONOMIQUE.md, 08_SECURITE_ASSURANCE_CONFORMITE.md,
-- 10_INTERNATIONAL_MULTILINGUE_MULTIDEVISE.md
-- Architecture MVP : monolithe modulaire (une base, tables regroupées par domaine).
-- Toutes les dates sont en UTC (timestamptz). Montants en unités mineures (centimes) entiers.

create extension if not exists "uuid-ossp";
create extension if not exists postgis;
create extension if not exists btree_gist;

-- ============================================================
-- 1. Pays / configuration marché (10)
-- ============================================================
create table if not exists country_configs (
  country_code text primary key,           -- ISO 3166-1 alpha-2
  name text not null,
  supported_languages text[] not null default '{fr}',
  default_currency text not null default 'EUR',
  supported_currencies text[] not null default '{EUR}',
  driving_side text not null default 'right',
  phone_prefix text not null,
  min_driver_age int not null default 21,
  tax_rules jsonb not null default '{}',
  insurance_rules jsonb not null default '{}',
  cancellation_rules jsonb not null default '{}',
  payment_methods text[] not null default '{card}',
  vehicle_categories text[] not null default '{}',
  active boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 2. Utilisateurs / organisations
-- ============================================================
-- account_type est LA source de vérité pour la séparation des espaces
-- Particulier / Professionnel (voir mission "séparation totale des
-- espaces"). Exactement deux valeurs : un compte 'individual' ne peut que
-- louer, un compte 'professional' est seul autorisé à publier des biens
-- (vehicles/listings, voir policies plus bas). Fixé une fois à l'inscription
-- et rendu immuable ensuite par le trigger profiles_account_type_immutable.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  account_type text not null default 'individual' check (account_type in ('individual','professional')),
  full_name text,
  first_name text,
  last_name text,
  date_of_birth date,
  phone text,
  address_line text,
  city text,
  postal_code text,
  country_code text references country_configs(country_code),
  preferred_language text not null default 'fr',
  preferred_currency text not null default 'EUR',
  avatar_url text,
  trust_score numeric,                     -- score interne "centre de confiance", jamais exposé brut (08)
  identity_verified boolean not null default false,
  licence_verified boolean not null default false,
  address_verified boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists driver_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  licence_number_masked text,
  licence_country text,
  licence_expires_on date,
  licence_verified_at timestamptz,
  selfie_verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  legal_name text,
  registration_number text,                -- SIRET (FR) ou équivalent registre du commerce selon le pays
  legal_form text,                         -- SARL, SAS, auto-entrepreneur, etc.
  legal_representative_name text,
  legal_representative_role text,
  country_code text references country_configs(country_code),
  billing_email text,
  verified_at timestamptz,                 -- KYB (Know Your Business) validé — Kbis/registre vérifié
  created_at timestamptz not null default now()
);

create table if not exists organization_members (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role text not null check (role in ('owner_admin','fleet_manager','agent','accounting','support','read_only')),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

-- ============================================================
-- 3. Véhicules / annonces
-- ============================================================
create table if not exists vehicles (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references profiles(id) on delete set null,
  organization_id uuid references organizations(id) on delete set null,
  owner_kind text not null default 'individual'
    check (owner_kind in ('individual','professional','platform_fleet')),
    -- individual/professional : bien mis en location par un utilisateur (marketplace P2P)
    -- platform_fleet : véhicule possédé et exploité directement par CAR ONE PLUS (ex. utilitaires/camions Maroc)
  category text not null,                  -- citadine, compacte, berline, suv, premium, luxe, electrique,
                                            -- utilitaire, fourgon, camion, moto, scooter, velo, trottinette,
                                            -- yacht, aeronef, jet_prive (catégories — 02)
  make text not null,
  model text not null,
  version text,
  year int,
  registration_country text,
  registration_masked text,
  seats int,
  transmission text check (transmission in ('manual','auto') ),
  fuel_type text check (fuel_type in ('petrol','diesel','electric','hybrid','other')),
  mileage_km int,
  specs jsonb not null default '{}',       -- champs spécifiques utilitaires: longueur, volume, charge_utile...
  location geography(Point, 4326),
  location_label text,
  connected_device_id uuid,
  status text not null default 'draft' check (status in ('draft','active','maintenance','immobilized','archived')),
  created_at timestamptz not null default now()
);

-- Checklist de mise en ligne par catégorie (08 : "ne pas lancer une catégorie sans définir
-- éligibilité, documents, assurance, dépôt..." — piloté en config, pas en dur dans le code)
create table if not exists category_requirements (
  category text primary key,
  min_photos int not null default 6,
  required_documents text[] not null default '{}',   -- ex: carte_grise, assurance, permis_navigation...
  requires_identity_verification boolean not null default true,
  requires_licence_verification boolean not null default true,
  requires_professional_status boolean not null default false, -- ex: aéronefs/jets réservés aux pros vérifiés
  min_owner_age int not null default 18,
  insurance_required boolean not null default true,
  active boolean not null default true,     -- feature flag catégorie, activable/désactivable par marché
  notes text
);

create table if not exists vehicle_documents (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  doc_type text not null,                  -- carte_grise, assurance, controle_technique...
  file_url text not null,
  verified boolean not null default false,
  expires_on date,
  created_at timestamptz not null default now()
);

create table if not exists listings (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  title text not null,
  description text,
  photos text[] not null default '{}',
  currency text not null default 'EUR',
  price_minute_minor int,
  price_hour_minor int,
  price_day_minor int not null,
  price_week_minor int,
  price_month_minor int,
  included_km_per_day int,
  extra_km_price_minor int,
  deposit_minor int not null default 0,
  cleaning_fee_minor int not null default 0,
  service_fee_minor int not null default 0,
  instant_booking boolean not null default false,
  delivery_enabled boolean not null default false,
  delivery_fee_minor int,
  pickup_mode text not null default 'meetup' check (pickup_mode in ('digital_key','meetup','agency')),
  rules jsonb not null default '{}',       -- conditions conducteur, fumeur, animaux, km, etc.
  status text not null default 'pending' check (status in ('pending','published','paused','rejected')),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists availability_blocks (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid not null references listings(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text not null default 'owner_block' check (reason in ('owner_block','booking','maintenance')),
  exclude period tstzrange generated always as (tstzrange(starts_at, ends_at, '[)')) stored,
  exclude constraint availability_no_overlap exclude using gist (listing_id with =, period with &&)
);

create table if not exists price_rules (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid not null references listings(id) on delete cascade,
  label text,
  starts_on date,
  ends_on date,
  multiplier numeric not null default 1.0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 4. Réservations / paiements
-- ============================================================
create table if not exists bookings (
  id uuid primary key default uuid_generate_v4(),
  listing_id uuid not null references listings(id),
  renter_id uuid not null references profiles(id),
  status text not null default 'pending_approval'
    check (status in ('pending_approval','confirmed','active','completed','cancelled','declined')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  pickup_mode text not null,
  delivery_address text,
  display_currency text not null default 'EUR',
  charge_currency text not null default 'EUR',
  payout_currency text not null default 'EUR',
  fx_rate numeric not null default 1.0,
  fx_rate_at timestamptz not null default now(),
  rental_minor int not null,
  protection_minor int not null default 0,
  options_minor int not null default 0,
  delivery_minor int not null default 0,
  deposit_minor int not null default 0,
  platform_fee_minor int not null default 0,   -- commission 5% par défaut (07), configurable
  owner_payout_minor int not null default 0,
  total_minor int not null,
  cancellation_policy jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists booking_drivers (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references bookings(id) on delete cascade,
  driver_profile_id uuid not null references driver_profiles(id),
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references bookings(id) on delete cascade,
  provider text not null default 'unset',      -- PSP à sélectionner (04)
  provider_ref text,
  idempotency_key text not null unique,
  kind text not null check (kind in ('charge','refund','deposit_hold','deposit_release','deposit_capture')),
  amount_minor int not null,
  currency text not null,
  status text not null default 'pending' check (status in ('pending','succeeded','failed','refunded')),
  created_at timestamptz not null default now()
);

create table if not exists payouts (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references profiles(id),
  organization_id uuid references organizations(id),
  booking_id uuid references bookings(id),
  amount_minor int not null,
  currency text not null,
  status text not null default 'pending' check (status in ('pending','paid','failed')),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists contracts (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references bookings(id) on delete cascade,
  pdf_url text,
  -- Chaque contrat exige la signature électronique des deux parties
  -- (locataire ET propriétaire/professionnel) avant d'être considéré valide.
  renter_signature_url text,
  owner_signature_url text,
  renter_signed_at timestamptz,
  owner_signed_at timestamptz,
  status text not null default 'pending_renter' check (status in ('pending_renter','pending_owner','completed')),
  timezone text not null default 'UTC',
  created_at timestamptz not null default now()
);

-- ============================================================
-- 5. État des lieux / sinistres
-- ============================================================
create table if not exists inspections (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references bookings(id) on delete cascade,
  phase text not null check (phase in ('check_in','check_out')),
  mileage_km int,
  fuel_level numeric,
  battery_level numeric,
  photos text[] not null default '{}',
  video_url text,
  checklist jsonb not null default '{}',
  geolocation geography(Point, 4326),
  validated_by_renter boolean not null default false,
  validated_by_owner boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists damages (
  id uuid primary key default uuid_generate_v4(),
  inspection_id uuid references inspections(id) on delete set null,
  booking_id uuid not null references bookings(id) on delete cascade,
  description text,
  photos text[] not null default '{}',
  severity text check (severity in ('minor','moderate','major')),
  created_at timestamptz not null default now()
);

create table if not exists incidents (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references bookings(id) on delete cascade,
  damage_id uuid references damages(id),
  reported_by uuid references profiles(id),
  status text not null default 'open' check (status in ('open','under_review','decided','closed')),
  timeline jsonb not null default '[]',
  decision text,
  created_at timestamptz not null default now()
);

create table if not exists insurance_policies (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid references vehicles(id),
  country_code text references country_configs(country_code),
  provider text,
  policy_ref text,
  confirmed boolean not null default false,   -- ne jamais afficher "assurance incluse" sans confirmation (08)
  coverage jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ============================================================
-- 6. Messagerie / avis / support
-- ============================================================
create table if not exists message_threads (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references bookings(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  thread_id uuid not null references message_threads(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  body text,
  attachments text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references bookings(id) on delete cascade,
  author_id uuid not null references profiles(id),
  target_type text not null check (target_type in ('vehicle','renter','owner')),
  rating numeric not null check (rating between 1 and 5),
  sub_ratings jsonb not null default '{}',
  comment text,
  owner_reply text,
  moderated boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists maintenance_records (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz,
  reason text,
  cost_minor int,
  created_at timestamptz not null default now()
);

create table if not exists support_tickets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id),
  booking_id uuid references bookings(id),
  vehicle_id uuid references vehicles(id),
  subject text not null,
  priority text not null default 'p3' check (priority in ('p1','p2','p3','p4')),
  status text not null default 'open' check (status in ('open','pending','resolved','closed')),
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null,
  title text,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists promos (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percent','fixed')),
  discount_value numeric not null,
  currency text,
  starts_on date,
  ends_on date,
  active boolean not null default true
);

create table if not exists audit_log (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references profiles(id),
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ============================================================
-- 7. Télématique (phase 2)
-- ============================================================
create table if not exists telematics_devices (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  provider text not null,
  external_ref text,
  privacy_mode_outside_booking boolean not null default true,
  created_at timestamptz not null default now()
);
alter table vehicles
  add constraint vehicles_connected_device_fk foreign key (connected_device_id) references telematics_devices(id) on delete set null;

create table if not exists telematics_events (
  id uuid primary key default uuid_generate_v4(),
  device_id uuid not null references telematics_devices(id) on delete cascade,
  booking_id uuid references bookings(id),
  event_type text not null,                -- lock, unlock, alert, diagnostic...
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ============================================================
-- Indexes
-- ============================================================
create index if not exists idx_listings_vehicle on listings(vehicle_id);
create index if not exists idx_vehicles_location on vehicles using gist(location);
create index if not exists idx_bookings_listing on bookings(listing_id);
create index if not exists idx_bookings_renter on bookings(renter_id);
create index if not exists idx_bookings_status on bookings(status);
create index if not exists idx_messages_thread on messages(thread_id);
create index if not exists idx_reviews_booking on reviews(booking_id);

-- ============================================================
-- SÉPARATION DES ESPACES — enforcement au niveau base (RLS)
-- ============================================================
-- Un compte n'est jamais reçu à changer d'espace de son propre chef. Deux
-- garde-fous complémentaires à la restriction côté navigation
-- (AppNavigator.js) :
--   1. account_type est immuable après création (trigger ci-dessous) ;
--   2. les policies RLS vérifient account_type pour toute action réservée
--      à un des deux espaces (publier un bien = professional, réserver =
--      individual), donc même un appel API direct forgé côté client échoue.

-- Fonction utilitaire : account_type de l'appelant courant. security definer
-- pour lire `profiles` sans dépendre de la policy de select (évite toute
-- récursion RLS) ; volatile car lue à chaque appel dans une policy.
create or replace function public.current_account_type()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select account_type from profiles where id = auth.uid();
$$;

-- Immutabilité de account_type : aucune UPDATE ne peut le changer, même si
-- une policy le permettait par erreur plus tard. C'est le garde-fou
-- définitif de la mission "un compte = un type de compte, pour toujours".
create or replace function public.profiles_account_type_guard()
returns trigger
language plpgsql
as $$
begin
  if new.account_type is distinct from old.account_type then
    raise exception 'account_type is immutable and cannot be changed after account creation';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_account_type_immutable on profiles;
create trigger profiles_account_type_immutable
  before update on profiles
  for each row execute function public.profiles_account_type_guard();

alter table profiles enable row level security;
alter table vehicles enable row level security;
alter table listings enable row level security;
alter table bookings enable row level security;
alter table messages enable row level security;
alter table message_threads enable row level security;
alter table reviews enable row level security;
alter table notifications enable row level security;
alter table organizations enable row level security;
alter table organization_members enable row level security;

create policy "profiles_self" on profiles for select using (auth.uid() = id);
-- account_type est envoyé dans la ligne insérée mais ne peut plus jamais
-- bouger ensuite (trigger ci-dessus) — l'insert reste libre sur les deux
-- valeurs autorisées par la contrainte check de la colonne.
create policy "profiles_self_insert" on profiles for insert with check (auth.uid() = id);
create policy "profiles_self_update" on profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "listings_public_read" on listings for select using (status = 'published');
create policy "vehicles_public_read" on vehicles for select using (
  owner_id = auth.uid()
  or exists (select 1 from listings l where l.vehicle_id = vehicles.id and l.status = 'published')
);
-- Publier un bien (créer/modifier/supprimer une fiche véhicule) n'est
-- possible que pour un compte account_type = 'professional' — c'est la
-- règle centrale de la mission : "toute personne qui veut mettre son bien
-- en location doit passer par le compte professionnel", appliquée ici
-- indépendamment de ce que montre l'interface.
create policy "vehicles_owner_insert" on vehicles for insert with check (
  auth.uid() = owner_id and public.current_account_type() = 'professional'
);
create policy "vehicles_owner_update" on vehicles for update using (
  auth.uid() = owner_id and public.current_account_type() = 'professional'
) with check (
  auth.uid() = owner_id and public.current_account_type() = 'professional'
);
create policy "vehicles_owner_delete" on vehicles for delete using (
  auth.uid() = owner_id and public.current_account_type() = 'professional'
);
create policy "listings_owner_manage" on listings for all using (
  exists (
    select 1 from vehicles v where v.id = listings.vehicle_id
    and v.owner_id = auth.uid() and public.current_account_type() = 'professional'
  )
);

create policy "bookings_renter_read" on bookings for select using (auth.uid() = renter_id);
create policy "bookings_owner_read" on bookings for select using (
  exists (
    select 1 from listings l join vehicles v on v.id = l.vehicle_id
    where l.id = bookings.listing_id and v.owner_id = auth.uid()
  )
);
-- Réserver (être renter_id sur une booking) n'est possible que pour un
-- compte account_type = 'individual' — miroir exact de la règle ci-dessus
-- côté vehicles/listings : un compte professionnel ne loue pas via son
-- propre compte, il gère des biens (voir mission, schéma final).
create policy "bookings_renter_insert" on bookings for insert with check (
  auth.uid() = renter_id and public.current_account_type() = 'individual'
);

create policy "notifications_self" on notifications for select using (auth.uid() = user_id);

create policy "messages_participant" on messages for select using (
  exists (
    select 1 from message_threads t join bookings b on b.id = t.booking_id
    where t.id = messages.thread_id and (b.renter_id = auth.uid())
  )
);

-- Une organisation ne peut être créée que par un compte professionnel, et
-- seuls ses membres (organization_members) peuvent la lire/gérer.
create policy "organizations_professional_insert" on organizations for insert with check (
  public.current_account_type() = 'professional'
);
create policy "organizations_member_read" on organizations for select using (
  exists (select 1 from organization_members m where m.organization_id = organizations.id and m.user_id = auth.uid())
);
create policy "organizations_admin_update" on organizations for update using (
  exists (
    select 1 from organization_members m
    where m.organization_id = organizations.id and m.user_id = auth.uid() and m.role = 'owner_admin'
  )
);

create policy "org_members_self_read" on organization_members for select using (
  user_id = auth.uid()
  or exists (select 1 from organization_members m2 where m2.organization_id = organization_members.organization_id and m2.user_id = auth.uid())
);
-- Bootstrap : le tout premier membre d'une organisation neuve peut
-- s'auto-insérer (obligatoire, sinon aucune organisation ne pourrait jamais
-- avoir de premier owner_admin) ; ensuite, seul un owner_admin existant peut
-- ajouter de nouveaux collaborateurs.
create policy "org_members_admin_manage" on organization_members for insert with check (
  public.current_account_type() = 'professional'
  and (
    (user_id = auth.uid() and not exists (
      select 1 from organization_members m2 where m2.organization_id = organization_members.organization_id
    ))
    or exists (
      select 1 from organization_members m
      where m.organization_id = organization_members.organization_id and m.user_id = auth.uid() and m.role = 'owner_admin'
    )
  )
);
create policy "org_members_admin_delete" on organization_members for delete using (
  exists (
    select 1 from organization_members m
    where m.organization_id = organization_members.organization_id and m.user_id = auth.uid() and m.role = 'owner_admin'
  )
);

create policy "reviews_public_read" on reviews for select using (moderated = true);

-- ============================================================
-- Seed — checklist de mise en ligne par catégorie (à ajuster en back-office)
-- ============================================================
insert into category_requirements (category, min_photos, required_documents, requires_professional_status, min_owner_age, notes) values
  ('citadine', 6, '{carte_grise,assurance,controle_technique}', false, 21, null),
  ('compacte', 6, '{carte_grise,assurance,controle_technique}', false, 21, null),
  ('berline', 6, '{carte_grise,assurance,controle_technique}', false, 21, null),
  ('suv', 6, '{carte_grise,assurance,controle_technique}', false, 21, null),
  ('premium', 8, '{carte_grise,assurance,controle_technique}', false, 23, null),
  ('luxe', 10, '{carte_grise,assurance,controle_technique}', false, 25, null),
  ('electrique', 6, '{carte_grise,assurance,controle_technique}', false, 21, null),
  ('moto', 6, '{carte_grise,assurance,permis_moto}', false, 21, null),
  ('scooter', 4, '{carte_grise,assurance}', false, 18, null),
  ('velo', 3, '{}', false, 18, 'Pas de documents véhicule requis'),
  ('trottinette', 3, '{}', false, 18, 'Pas de documents véhicule requis'),
  ('utilitaire', 6, '{carte_grise,assurance,controle_technique,permis_pro_si_requis}', false, 21, null),
  ('fourgon', 6, '{carte_grise,assurance,controle_technique,permis_pro_si_requis}', true, 23, null),
  ('camion', 8, '{carte_grise,assurance,controle_technique,permis_poids_lourd}', true, 25, null),
  ('yacht', 12, '{acte_francisation,assurance_nautique,certificat_navigation,permis_bateau}', true, 25, 'Vérification pro renforcée'),
  ('aeronef', 15, '{certificat_immatriculation,assurance_aeronautique,licence_pilote,certificat_navigabilite}', true, 25, 'Module réglementé — non activé par défaut'),
  ('jet_prive', 15, '{certificat_immatriculation,assurance_aeronautique,licence_pilote,certificat_navigabilite}', true, 25, 'Module réglementé — non activé par défaut')
on conflict (category) do nothing;

-- Désactivation par défaut des catégories premium tant que le cadre juridique n'est pas validé (roadmap phase 5)
update category_requirements set active = false where category in ('yacht','aeronef','jet_prive');

insert into country_configs (country_code, name, supported_languages, default_currency, supported_currencies, phone_prefix, vehicle_categories, active) values
  ('MA', 'Maroc', '{fr,ar,en}', 'MAD', '{MAD,EUR,USD}', '+212',
    '{citadine,compacte,berline,suv,electrique,moto,scooter,velo,trottinette,utilitaire,fourgon,camion}', true),
  ('FR', 'France', '{fr,en}', 'EUR', '{EUR}', '+33',
    '{citadine,compacte,berline,suv,premium,luxe,electrique,moto,scooter,velo,trottinette,utilitaire,fourgon,yacht}', true)
on conflict (country_code) do nothing;
