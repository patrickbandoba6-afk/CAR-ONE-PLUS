// Configurateur "par usage" — exploite la largeur du catalogue (17 catégories,
// du vélo au jet privé) pour recommander directement le bon type de véhicule
// plutôt que de faire naviguer par catégorie. Alimente searchFilters via
// HomeScreen puis ResultsScreen (mêmes filtres que la recherche classique).
export const USAGE_PRESETS = [
  { id: 'daily', icon: 'sunny-outline', label: 'Quotidien', filterCategories: ['citadine', 'compacte', 'electrique', 'scooter'] },
  { id: 'airport', icon: 'airplane-outline', label: 'Trajet aéroport', filterCategories: ['berline', 'premium', 'suv'], instantBookingOnly: true },
  { id: 'moving', icon: 'cube-outline', label: 'Déménagement', filterCategories: ['utilitaire', 'fourgon', 'camion'] },
  { id: 'weekend', icon: 'partly-sunny-outline', label: 'Week-end', filterCategories: ['suv', 'premium', 'luxe'] },
  { id: 'business', icon: 'briefcase-outline', label: 'Événement pro', filterCategories: ['berline', 'premium', 'luxe'] },
  { id: 'eco', icon: 'leaf-outline', label: 'Trajet urbain écolo', filterCategories: ['velo', 'trottinette', 'electrique', 'scooter'] },
];
