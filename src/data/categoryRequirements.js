// Miroir côté app de la table category_requirements (supabase/schema.sql) —
// pilote l'assistant "Mettre en location" : personne ne publie sans avoir
// fourni photos + documents + validé les procédures propres à sa catégorie.
export const CATEGORY_REQUIREMENTS = {
  citadine: { minPhotos: 6, documents: ['Carte grise', 'Attestation d\'assurance', 'Contrôle technique'], professionalOnly: false, minOwnerAge: 21, active: true },
  compacte: { minPhotos: 6, documents: ['Carte grise', 'Attestation d\'assurance', 'Contrôle technique'], professionalOnly: false, minOwnerAge: 21, active: true },
  berline: { minPhotos: 6, documents: ['Carte grise', 'Attestation d\'assurance', 'Contrôle technique'], professionalOnly: false, minOwnerAge: 21, active: true },
  suv: { minPhotos: 6, documents: ['Carte grise', 'Attestation d\'assurance', 'Contrôle technique'], professionalOnly: false, minOwnerAge: 21, active: true },
  premium: { minPhotos: 8, documents: ['Carte grise', 'Attestation d\'assurance', 'Contrôle technique'], professionalOnly: false, minOwnerAge: 23, active: true },
  luxe: { minPhotos: 10, documents: ['Carte grise', 'Attestation d\'assurance', 'Contrôle technique'], professionalOnly: false, minOwnerAge: 25, active: true },
  electrique: { minPhotos: 6, documents: ['Carte grise', 'Attestation d\'assurance', 'Contrôle technique'], professionalOnly: false, minOwnerAge: 21, active: true },
  moto: { minPhotos: 6, documents: ['Carte grise', 'Attestation d\'assurance', 'Permis moto'], professionalOnly: false, minOwnerAge: 21, active: true },
  scooter: { minPhotos: 4, documents: ['Carte grise', 'Attestation d\'assurance'], professionalOnly: false, minOwnerAge: 18, active: true },
  velo: { minPhotos: 3, documents: [], professionalOnly: false, minOwnerAge: 18, active: true },
  trottinette: { minPhotos: 3, documents: [], professionalOnly: false, minOwnerAge: 18, active: true },
  utilitaire: { minPhotos: 6, documents: ['Carte grise', 'Attestation d\'assurance', 'Contrôle technique'], professionalOnly: false, minOwnerAge: 21, active: true },
  fourgon: { minPhotos: 6, documents: ['Carte grise', 'Attestation d\'assurance', 'Contrôle technique', 'Permis pro si requis'], professionalOnly: true, minOwnerAge: 23, active: true },
  camion: { minPhotos: 8, documents: ['Carte grise', 'Attestation d\'assurance', 'Contrôle technique', 'Permis poids lourd'], professionalOnly: true, minOwnerAge: 25, active: true },
  yacht: { minPhotos: 12, documents: ['Acte de francisation', 'Assurance nautique', 'Certificat de navigation', 'Permis bateau'], professionalOnly: true, minOwnerAge: 25, active: false, comingSoon: true },
  aeronef: { minPhotos: 15, documents: ['Certificat d\'immatriculation', 'Assurance aéronautique', 'Licence pilote', 'Certificat de navigabilité'], professionalOnly: true, minOwnerAge: 25, active: false, comingSoon: true },
  jet_prive: { minPhotos: 15, documents: ['Certificat d\'immatriculation', 'Assurance aéronautique', 'Licence pilote', 'Certificat de navigabilité'], professionalOnly: true, minOwnerAge: 25, active: false, comingSoon: true },
};

export const LISTING_STEPS = [
  'category',
  'basic_info',
  'photos',
  'documents',
  'pricing',
  'access_mode',
  'rules',
  'review',
];
