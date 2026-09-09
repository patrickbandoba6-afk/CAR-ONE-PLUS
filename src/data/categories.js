// Catégories affichées à l'accueil — ordre aligné sur la maquette de référence.
// Chaque catégorie renvoie à category_requirements côté back (checklist de mise en ligne).
export const CATEGORIES = [
  { id: 'citadine_berline_suv', label: 'Voitures', icon: 'car-sport', group: 'route', filterCategories: ['citadine', 'compacte', 'berline', 'suv', 'premium', 'luxe', 'electrique'] },
  { id: 'moto', label: 'Motos', icon: 'bicycle', group: 'route', filterCategories: ['moto', 'scooter'] },
  { id: 'aeronef', label: 'Avions', icon: 'airplane', group: 'premium', filterCategories: ['aeronef'] },
  { id: 'jet_prive', label: 'Jets privés', icon: 'rocket', group: 'premium', filterCategories: ['jet_prive'] },
  { id: 'yacht', label: 'Yachts', icon: 'boat', group: 'premium', filterCategories: ['yacht'] },
  { id: 'trottinette', label: 'Trottinettes', icon: 'flash', group: 'douce', filterCategories: ['trottinette'] },
  { id: 'velo', label: 'Vélos', icon: 'bicycle-outline', group: 'douce', filterCategories: ['velo'] },
  { id: 'utilitaire_camion', label: 'Utilitaires & Camions', icon: 'bus', group: 'flotte', filterCategories: ['utilitaire', 'fourgon', 'camion'] },
];

export const CATEGORY_LABELS = {
  citadine: 'Citadine', compacte: 'Compacte', berline: 'Berline', suv: 'SUV',
  premium: 'Premium', luxe: 'Luxe', electrique: 'Électrique',
  moto: 'Moto', scooter: 'Scooter', velo: 'Vélo', trottinette: 'Trottinette',
  utilitaire: 'Utilitaire', fourgon: 'Fourgon', camion: 'Camion',
  yacht: 'Yacht', aeronef: 'Avion', jet_prive: 'Jet privé',
};

// Catégories "premium" nécessitant un cadre réglementaire dédié (08/09) —
// désactivées par défaut tant que le marché n'a pas validé assurance/juridique.
export const PREMIUM_CATEGORIES = ['yacht', 'aeronef', 'jet_prive'];
