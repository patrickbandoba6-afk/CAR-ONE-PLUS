// Demandes de réservation "flotte" — modèle propositions multiples : plusieurs
// personnes peuvent demander le même bien, le propriétaire/professionnel
// choisit à qui il l'accorde (contrairement à bookings/DEMO_BOOKINGS qui est
// une réservation instantanée déjà confirmée). Utilisé par ProBookingsScreen
// et OwnerBookingsScreen (organisés par catégorie → bien → demandeurs).
export const DEMO_BOOKING_REQUESTS = [
  { id: 'req-1', listingId: 'v1', requesterId: 'req-nadia', requesterName: 'Nadia El Fassi', startsAt: '2026-09-20T09:00:00Z', endsAt: '2026-09-23T09:00:00Z', priceMinor: 26700, currency: 'EUR', status: 'pending', createdAt: '2026-09-10T14:00:00Z' },
  { id: 'req-2', listingId: 'v1', requesterId: 'req-youssef', requesterName: 'Youssef Amrani', startsAt: '2026-09-20T09:00:00Z', endsAt: '2026-09-24T09:00:00Z', priceMinor: 35600, currency: 'EUR', status: 'pending', createdAt: '2026-09-11T09:30:00Z' },
  { id: 'req-3', listingId: 'v5', requesterId: 'req-salma', requesterName: 'Salma Idrissi', startsAt: '2026-09-18T10:00:00Z', endsAt: '2026-09-19T10:00:00Z', priceMinor: 4200, currency: 'EUR', status: 'pending', createdAt: '2026-09-12T08:00:00Z' },
  { id: 'req-4', listingId: 'v6', requesterId: 'req-mehdi', requesterName: 'Mehdi Ouazzani', startsAt: '2026-09-16T08:00:00Z', endsAt: '2026-09-16T20:00:00Z', priceMinor: 1200, currency: 'EUR', status: 'pending', createdAt: '2026-09-13T11:00:00Z' },
  { id: 'req-5', listingId: 'v8', requesterId: 'req-leila', requesterName: 'Leïla Bensouda', startsAt: '2026-10-02T09:00:00Z', endsAt: '2026-10-04T09:00:00Z', priceMinor: 240000, currency: 'EUR', status: 'pending', createdAt: '2026-09-13T16:00:00Z' },
  { id: 'req-6', listingId: 'v9', requesterId: 'req-karim', requesterName: 'Karim Zniber', startsAt: '2026-10-05T07:00:00Z', endsAt: '2026-10-05T22:00:00Z', priceMinor: 450000, currency: 'EUR', status: 'pending', createdAt: '2026-09-14T07:00:00Z' },
];
