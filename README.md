# CAR ONE PLUS — Application mobile (Expo / React Native)

Plateforme de location et d'autopartage : voitures, utilitaires, camions,
motos, scooters, vélos, trottinettes — et, en catégories premium à cadre
réglementaire dédié, yachts, avions et jets privés.

Deux sources de véhicules cohabitent dans l'app :
- **Marketplace** : particuliers et professionnels mettent leurs propres
  biens en location (photos, documents, vérification obligatoires avant
  publication — voir plus bas).
- **Flotte propre CAR ONE PLUS** : véhicules possédés et exploités
  directement par la plateforme (utilitaires, camions — opérations basées
  au Maroc), loués au même titre que les annonces marketplace.

Ce projet est **indépendant** de `globaly-jc-app` (marketplace généraliste) :
autre app, autre identité de marque, autre base de code.

## Construit à partir du dossier produit fourni

Le dossier complet (cahier des charges, spec fonctionnelle, architecture
technique, modèle de données, inventaire des 90 écrans, modèle économique,
sécurité/conformité, roadmap, charte UI/UX en .md/.docx/.pdf et images de
référence) est conservé dans [`docs/`](./docs) et sert de référence pour
la suite du développement. Le design suit la maquette et le logo fournis
par le porteur de projet (fond sombre, accent or) — palette distincte de
celle initialement proposée dans `docs/01_CHARTE_PRODUIT_UI_UX.md`.

## Ce qui est implémenté (Phase 1 — MVP, alignée sur `09_ROADMAP.md`)

- **Parcours locataire complet** : onboarding, inscription/connexion,
  vérification d'identité, accueil, recherche, filtres, résultats,
  carte (liste géolocalisée — fournisseur cartographique non encore
  sélectionné), fiche véhicule, galerie, détail de prix, options,
  paiement (simulé — PSP non encore sélectionné), confirmation.
- **Cycle de réservation** : détail réservation, instructions, accès
  digital (dépend d'un boîtier connecté — Phase 2), état des lieux
  guidé (check-in/check-out partagent le même écran), location en
  cours, carte de trajet, assistance, déclaration de dommage, centre
  de résolution d'incident, facture, avis.
- **Parcours propriétaire complet**, avec en son centre l'**assistant
  de mise en location** (`src/screens/owner/AddVehicleScreen.js`) :
  catégorie → infos → photos → documents → tarification → mode de
  remise → règles → récapitulatif. Chaque catégorie a sa propre
  checklist (nombre de photos minimum, documents requis, statut
  professionnel obligatoire ou non, âge minimum) pilotée par
  `src/data/categoryRequirements.js` (miroir de la table
  `category_requirements` du schéma Supabase) — personne ne publie
  sans avoir fourni ce qui est exigé pour sa catégorie.
- **Tableau de bord propriétaire** : mes véhicules, documents, photos,
  tarification, calendrier, règles, mode d'accès, réservations,
  revenus, versements, maintenance, sinistres, statistiques.
- **Compte** : profil, conducteurs, documents, paiements, notifications,
  confidentialité, sécurité, aide, conditions.
- **i18n** : FR (par défaut) + EN, architecture prête pour d'autres
  langues (`src/i18n`).
- **Multi-devise** : formatage via `Intl.NumberFormat` (`src/utils/format.js`).

## Ce qui est volontairement un écran "à venir"

Les modules **Professionnel/flotte avancée**, **Back-office** et
**Premium (yacht/aéronef/jet privé)** correspondent aux phases 3 à 5 de la
roadmap : ils sont **présents dans la navigation** (aucun écran de
l'inventaire n'est manquant — voir `src/navigation/stubScreens.js`) mais
affichent un écran "Bientôt disponible" plutôt qu'une fonctionnalité non
construite. Idem pour la clé digitale/télématique (Phase 2), qui dépend
d'un boîtier connecté non encore intégré.

Les catégories yacht/aéronef/jet privé sont désactivées par défaut dans
`category_requirements` (`active = false`) tant que le cadre juridique et
assurantiel n'est pas validé pour un marché donné (`08_SECURITE_...md`).

## Lancer le projet

```bash
cd car-one-plus-app
npm install
npx expo start
```

Scannez le QR code avec **Expo Go** (App Store / Play Store), ou pressez
`w` pour lancer la version web (`react-native-web`).

## Backend (Supabase)

Le schéma complet est dans `supabase/schema.sql` : utilisateurs,
organisations (flotte pro), véhicules, annonces, disponibilités, règles de
prix, réservations, paiements, versements, dépôt de garantie, contrats,
états des lieux, dommages, incidents, assurance, messagerie, avis,
maintenance, support, notifications, promotions, audit, télématique,
configuration par pays (`country_configs`) et checklist de mise en ligne
par catégorie (`category_requirements`), avec RLS activée sur les tables
exposées côté client.

Tant que Supabase n'est pas configuré (`.env`), l'app fonctionne en mode
démo avec les données statiques de `src/data/` (`src/lib/supabase.js`
expose `isSupabaseConfigured`).

## Structure du projet

```
car-one-plus-app/
├── App.js
├── app.json
├── src/
│   ├── theme/colors.js          → palette (fond sombre, accent or)
│   ├── i18n/                    → fr.json, en.json
│   ├── data/                    → catalogue démo, catégories, checklist par catégorie
│   ├── context/AppStateContext.js → utilisateur démo, mode locataire/propriétaire, favoris, réservations
│   ├── navigation/
│   │   ├── AppNavigator.js      → RootStack + MainTabs (bascule locataire/propriétaire)
│   │   └── stubScreens.js       → écrans "à venir" (pro/back-office/premium)
│   ├── components/              → VehicleCard, CategoryChip, PrimaryButton, ScreenStub...
│   └── screens/
│       ├── public/              → onboarding, recherche, fiche véhicule, paiement...
│       ├── location/            → cycle de réservation (check-in/out, incident, facture, avis...)
│       ├── owner/                → assistant de mise en location, dashboard, revenus...
│       └── account/              → profil, sécurité, aide...
└── supabase/schema.sql
```

## Prochaines étapes suggérées

1. Choisir le PSP (paiement) et le fournisseur cartographique
   (`04_ARCHITECTURE_TECHNIQUE.md`) puis remplacer les écrans simulés
   (`PaymentScreen`, `MapScreen`, `TripMapScreen`).
2. Brancher l'app sur Supabase (remplacer `src/data/*` par des requêtes
   réelles) et déployer `supabase/schema.sql`.
3. Choisir le fournisseur KYC et remplacer le flux de vérification
   d'identité simulé.
4. Construire les modules Professionnel/Back-office (Phase 3) une fois
   le MVP validé.
