// Écrans "à venir" — préserve l'arborescence complète des 90 écrans du dossier
// (Professionnel, Back-office, Premium) sans prétendre les avoir construits.
// Chaque entrée devient un screen du RootStack pointant vers ScreenStub.
export const PROFESSIONAL_SCREENS = [
  { name: 'FleetImport', title: 'Import flotte', icon: 'cloud-upload-outline' },
  { name: 'FleetVehicle', title: 'Véhicule (flotte)', icon: 'car-outline' },
  { name: 'Permissions', title: 'Permissions', icon: 'key-outline' },
  { name: 'Clients', title: 'Clients', icon: 'person-outline' },
  { name: 'FleetPricing', title: 'Tarification flotte', icon: 'pricetag-outline' },
  { name: 'FleetMaintenance', title: 'Maintenance (flotte)', icon: 'construct-outline' },
  { name: 'FleetClaims', title: 'Sinistres (flotte)', icon: 'shield-outline' },
  { name: 'ApiIntegrations', title: 'API / Intégrations', icon: 'code-slash-outline' },
].map((s) => ({ ...s, phase: 'Phase 3 — Professionnels' }));

export const BACKOFFICE_SCREENS = [
  { name: 'BackofficeDashboard', title: 'Dashboard back-office', icon: 'grid-outline' },
  { name: 'BackofficeUsers', title: 'Utilisateurs', icon: 'people-outline' },
  { name: 'BackofficeKyc', title: 'KYC', icon: 'finger-print-outline' },
  { name: 'BackofficeVehicles', title: 'Véhicules', icon: 'car-sport-outline' },
  { name: 'BackofficeListings', title: 'Annonces', icon: 'list-outline' },
  { name: 'BackofficeBookings', title: 'Réservations', icon: 'calendar-outline' },
  { name: 'BackofficePayments', title: 'Paiements', icon: 'card-outline' },
  { name: 'BackofficeRefunds', title: 'Remboursements', icon: 'return-down-back-outline' },
  { name: 'BackofficeDisputes', title: 'Litiges', icon: 'warning-outline' },
  { name: 'BackofficeClaims', title: 'Sinistres', icon: 'shield-outline' },
  { name: 'BackofficeInsurance', title: 'Assurance', icon: 'umbrella-outline' },
  { name: 'BackofficeSupport', title: 'Support', icon: 'headset-outline' },
  { name: 'BackofficePromotions', title: 'Promotions', icon: 'pricetags-outline' },
  { name: 'BackofficeContent', title: 'Contenu', icon: 'newspaper-outline' },
  { name: 'BackofficePartners', title: 'Partenaires', icon: 'business-outline' },
  { name: 'BackofficeAudit', title: 'Audit', icon: 'document-lock-outline' },
  { name: 'BackofficeSettings', title: 'Paramètres', icon: 'settings-outline' },
].map((s) => ({ ...s, phase: 'Back-office — accès équipe interne' }));

export const PREMIUM_SCREENS = [
  { name: 'PremiumYacht', title: 'Yacht', icon: 'boat-outline' },
  { name: 'PremiumBoat', title: 'Bateau', icon: 'boat-outline' },
  { name: 'PremiumAircraft', title: 'Aéronef', icon: 'airplane-outline' },
  { name: 'PremiumJet', title: 'Jet privé', icon: 'rocket-outline' },
].map((s) => ({ ...s, phase: 'Phase 5 — Premium (cadre réglementaire dédié requis)' }));

export const ALL_STUB_SCREENS = [...PROFESSIONAL_SCREENS, ...BACKOFFICE_SCREENS, ...PREMIUM_SCREENS];
