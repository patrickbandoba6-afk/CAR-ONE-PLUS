// accountType: 'individual' | 'professional' — choisi une fois à l'inscription
// (AccountTypeScreen), distinct de `mode` (renter/owner/professional dans
// AppStateContext) qui est la vue active du moment. Un individuel bascule
// librement entre renter/owner ; un professionnel a son propre espace (KYB).
export const DEMO_USER = {
  id: 'demo-user',
  accountType: 'individual',
  fullName: 'Patrick B.',
  firstName: '',
  lastName: '',
  dateOfBirth: null,
  email: '',
  phone: '',
  avatarUri: null,
  addressLine: '',
  city: '',
  postalCode: '',
  identityVerified: false,
  licenceVerified: false,
  addressVerified: false,
  // Renseigné uniquement pour accountType === 'professional' (KYB — voir docs/08).
  company: {
    name: '',
    registrationNumber: '', // SIRET / registre du commerce
    legalForm: '',
    legalRepName: '',
    legalRepRole: '',
    verified: false,
  },
  preferredLanguage: 'fr',
  preferredCurrency: 'EUR',
  countryCode: 'MA',
};

export const DEMO_BOOKINGS = [
  {
    id: 'b1', vehicleId: 'v1', status: 'confirmed',
    startsAt: '2026-09-15T09:00:00Z', endsAt: '2026-09-18T09:00:00Z',
    totalMinor: 26700, currency: 'EUR',
  },
  {
    id: 'b2', vehicleId: 'v4', status: 'completed',
    startsAt: '2026-08-02T09:00:00Z', endsAt: '2026-08-04T09:00:00Z',
    totalMinor: 7800, currency: 'EUR',
  },
];
