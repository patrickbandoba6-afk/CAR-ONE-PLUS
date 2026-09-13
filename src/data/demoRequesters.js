// Profils démo des personnes qui demandent à réserver un bien — consultés par
// le propriétaire/professionnel avant d'accepter ou refuser (voir
// RequesterProfileScreen.js). Les documents sont représentés par leur statut
// (fourni/manquant), pas par de fausses pièces d'identité réalistes.
export const DEMO_REQUESTERS = {
  'req-nadia': {
    fullName: 'Nadia El Fassi', age: 34, memberSince: '2024', tripsCount: 12, ratingAsRenter: 4.9,
    identityVerified: true, licenceVerified: true,
    documents: [
      { key: 'identity', label: "Pièce d'identité", status: 'verified' },
      { key: 'licence', label: 'Permis de conduire', status: 'verified' },
      { key: 'address', label: 'Justificatif de domicile', status: 'verified' },
      { key: 'tax', label: 'Attestation fiscale', status: 'verified' },
    ],
  },
  'req-youssef': {
    fullName: 'Youssef Amrani', age: 28, memberSince: '2025', tripsCount: 3, ratingAsRenter: 4.6,
    identityVerified: true, licenceVerified: true,
    documents: [
      { key: 'identity', label: "Pièce d'identité", status: 'verified' },
      { key: 'licence', label: 'Permis de conduire', status: 'verified' },
      { key: 'address', label: 'Justificatif de domicile', status: 'missing' },
      { key: 'tax', label: 'Attestation fiscale', status: 'missing' },
    ],
  },
  'req-salma': {
    fullName: 'Salma Idrissi', age: 41, memberSince: '2023', tripsCount: 27, ratingAsRenter: 5.0,
    identityVerified: true, licenceVerified: true,
    documents: [
      { key: 'identity', label: "Pièce d'identité", status: 'verified' },
      { key: 'licence', label: 'Permis de conduire', status: 'verified' },
      { key: 'address', label: 'Justificatif de domicile', status: 'verified' },
      { key: 'tax', label: 'Attestation fiscale', status: 'verified' },
    ],
  },
  'req-mehdi': {
    fullName: 'Mehdi Ouazzani', age: 23, memberSince: '2026', tripsCount: 0, ratingAsRenter: null,
    identityVerified: true, licenceVerified: false,
    documents: [
      { key: 'identity', label: "Pièce d'identité", status: 'verified' },
      { key: 'licence', label: 'Permis de conduire', status: 'pending' },
      { key: 'address', label: 'Justificatif de domicile', status: 'missing' },
      { key: 'tax', label: 'Attestation fiscale', status: 'missing' },
    ],
  },
  'req-leila': {
    fullName: 'Leïla Bensouda', age: 46, memberSince: '2022', tripsCount: 41, ratingAsRenter: 4.8,
    identityVerified: true, licenceVerified: true,
    documents: [
      { key: 'identity', label: "Pièce d'identité", status: 'verified' },
      { key: 'licence', label: 'Permis de conduire', status: 'verified' },
      { key: 'address', label: 'Justificatif de domicile', status: 'verified' },
      { key: 'tax', label: 'Attestation fiscale', status: 'verified' },
    ],
  },
  'req-karim': {
    fullName: 'Karim Zniber', age: 39, memberSince: '2024', tripsCount: 8, ratingAsRenter: 4.7,
    identityVerified: true, licenceVerified: true,
    documents: [
      { key: 'identity', label: "Pièce d'identité", status: 'verified' },
      { key: 'licence', label: 'Permis de conduire', status: 'verified' },
      { key: 'address', label: 'Justificatif de domicile', status: 'verified' },
      { key: 'tax', label: 'Attestation fiscale', status: 'missing' },
    ],
  },
};
