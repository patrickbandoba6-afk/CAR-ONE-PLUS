// Étapes et documents requis à l'inscription, par type de compte choisi sur
// AccountTypeScreen ('individual' | 'professional') — miroir des colonnes
// ajoutées à profiles/organizations dans supabase/schema.sql.
// L'étape "signature" est commune aux deux parcours : elle sert aussi bien à
// signer un contrat en tant que locataire qu'en tant que propriétaire, donc
// tout le monde l'enregistre à l'inscription (voir SignaturePad.js, contracts
// dans AppStateContext.js).
export const KYC_STEPS = {
  individual: ['identity', 'address', 'documents', 'signature'],
  professional: ['company', 'representative', 'documents', 'signature'],
};

// Documents requis par type de compte — mêmes clés que le stockage générique
// `documents` d'AppStateContext, réutilisées telles quelles par l'écran
// Compte > Documents (AccountInfoScreen) une fois l'inscription terminée.
// Côté professionnel : à la fois les documents de la société (Kbis, contrôle
// technique flotte, assurance) et ceux de la personne (sa pièce d'identité,
// celle du représentant légal si distinct).
export const KYC_DOCUMENTS = {
  individual: ['identity', 'licence', 'address'],
  professional: ['kbis', 'identity', 'repId', 'insurance', 'technicalControl'],
};

// Libellés i18n (namespace "kyc") pour chaque clé de document ci-dessus.
export const KYC_DOCUMENT_LABEL_KEYS = {
  identity: 'docIdCard', licence: 'docLicence', address: 'docProofOfAddress',
  kbis: 'docKbis', repId: 'docRepId', insurance: 'docInsurance',
  technicalControl: 'docTechnicalControl',
};
