// Couche d'accès aux véhicules/annonces.
// Tant que Supabase n'est pas configuré (.env), on retombe sur le catalogue
// démo de src/data/vehicles.js — voir README ("mode démo").
// Une fois `supabase/schema.sql` déployé et `.env` renseigné, ces fonctions
// interrogent les tables `vehicles` + `listings` (+ `profiles` pour le
// propriétaire) au lieu des données statiques. Champs sans équivalent
// direct dans le schéma (rating/reviews) restent à null en attendant une
// vue d'agrégation sur `reviews` (voir 05_MODELE_DONNEES_API.md).
import { supabase, isSupabaseConfigured } from '../supabase';
import { DEMO_VEHICLES, getVehicleById as getDemoVehicleById, searchVehicles as searchDemoVehicles } from '../../data/vehicles';

const LISTING_SELECT = `
  id, currency, price_day_minor, included_km_per_day, extra_km_price_minor, instant_booking, pickup_mode, photos, status,
  vehicle:vehicles (
    id, category, owner_kind, make, model, version, year, seats, transmission, fuel_type, location_label,
    owner:profiles ( full_name )
  )
`;

function mapListingRow(row) {
  const v = row.vehicle || {};
  return {
    id: v.id,
    category: v.category,
    ownerKind: v.owner_kind,
    ownerName: v.owner?.full_name || (v.owner_kind === 'platform_fleet' ? 'CAR ONE PLUS' : null),
    make: v.make,
    model: v.model,
    version: v.version,
    year: v.year,
    seats: v.seats,
    transmission: v.transmission,
    fuel: v.fuel_type,
    photo: row.photos?.[0] || null,
    priceDayMinor: row.price_day_minor,
    includedKmPerDay: row.included_km_per_day ?? null,
    extraKmPriceMinor: row.extra_km_price_minor ?? null,
    currency: row.currency,
    rating: null,
    reviews: 0,
    locationLabel: v.location_label,
    instantBooking: row.instant_booking,
    digitalKey: row.pickup_mode === 'digital_key',
    badge: v.category,
    fleet: v.owner_kind === 'platform_fleet',
  };
}

// filters: { categories: string[], query: string }
export async function fetchVehicles(filters = {}) {
  if (!isSupabaseConfigured) return searchDemoVehicles(filters);

  let req = supabase.from('listings').select(LISTING_SELECT).eq('status', 'published');
  if (filters.categories?.length) {
    req = req.in('vehicle.category', filters.categories);
  }
  if (filters.instantBookingOnly) {
    req = req.eq('instant_booking', true);
  }
  const { data, error } = await req;
  if (error) {
    console.warn('fetchVehicles: Supabase error, repli sur le catalogue démo', error.message);
    return searchDemoVehicles(filters);
  }
  let results = (data || []).filter((row) => row.vehicle).map(mapListingRow);
  if (filters.query) {
    const q = filters.query.toLowerCase();
    results = results.filter((v) => `${v.make} ${v.model} ${v.locationLabel}`.toLowerCase().includes(q));
  }
  return results;
}

export async function fetchVehicleById(vehicleId) {
  if (!isSupabaseConfigured) return getDemoVehicleById(vehicleId);

  const { data, error } = await supabase
    .from('listings')
    .select(LISTING_SELECT)
    .eq('vehicle_id', vehicleId)
    .eq('status', 'published')
    .limit(1)
    .maybeSingle();
  if (error || !data) {
    if (error) console.warn('fetchVehicleById: Supabase error, repli sur le catalogue démo', error.message);
    return getDemoVehicleById(vehicleId);
  }
  return mapListingRow(data);
}

export function getDemoCatalog() {
  return DEMO_VEHICLES;
}

// Résout plusieurs véhicules par id (ex. pour une liste de réservations) en un
// seul aller-retour logique — s'appuie sur fetchVehicleById pour rester
// cohérent en mode démo comme en mode Supabase. Retourne { [id]: vehicle }.
export async function fetchVehiclesByIds(ids) {
  const uniqueIds = [...new Set(ids)];
  const results = await Promise.all(uniqueIds.map((id) => fetchVehicleById(id)));
  const byId = {};
  uniqueIds.forEach((id, i) => { byId[id] = results[i]; });
  return byId;
}

// Véhicules du propriétaire connecté, tous statuts confondus (brouillon inclus) —
// contrairement à fetchVehicles/fetchVehicleById qui ne renvoient que les
// annonces publiées côté marketplace. Tant que l'authentification réelle n'est
// pas branchée, le mode démo n'a pas de notion de "mes véhicules" : on retombe
// sur les véhicules non-flotte du catalogue démo (voir README).
export async function fetchOwnerVehicles() {
  if (!isSupabaseConfigured) {
    return DEMO_VEHICLES.filter((v) => v.ownerKind !== 'platform_fleet');
  }

  const { data: { user } = {} } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('vehicles')
    .select(`
      id, category, owner_kind, make, model, version, year, status,
      listings ( id, currency, price_day_minor, photos, status )
    `)
    .eq('owner_id', user.id);
  if (error) {
    console.warn('fetchOwnerVehicles: Supabase error, repli sur le catalogue démo', error.message);
    return DEMO_VEHICLES.filter((v) => v.ownerKind !== 'platform_fleet');
  }

  return (data || []).map((v) => {
    const listing = v.listings?.[0];
    return {
      id: v.id,
      category: v.category,
      ownerKind: v.owner_kind,
      make: v.make,
      model: v.model,
      version: v.version,
      year: v.year,
      status: v.status,
      photo: listing?.photos?.[0] || null,
      priceDayMinor: listing?.price_day_minor ?? null,
      currency: listing?.currency || 'EUR',
      listingStatus: listing?.status || null,
    };
  });
}
