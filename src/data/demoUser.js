export const DEMO_USER = {
  id: 'demo-user',
  fullName: 'Patrick B.',
  accountType: 'renter', // renter | owner | professional — évolutif après vérification (02)
  identityVerified: false,
  licenceVerified: false,
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
