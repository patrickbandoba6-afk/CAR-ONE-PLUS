// Catalogue de démonstration — permet de naviguer l'app hors connexion Supabase.
// En production, ces enregistrements vivent dans les tables vehicles/listings (voir supabase/schema.sql).
export const DEMO_VEHICLES = [
  {
    id: 'v1', category: 'suv', ownerKind: 'individual', ownerName: 'Yassine B.',
    make: 'Mercedes', model: 'GLE', version: '300d 4MATIC', year: 2023,
    seats: 5, transmission: 'auto', fuel: 'diesel',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Renault_Clio_V_1X7A0392.jpg',
    priceDayMinor: 8900, currency: 'EUR', rating: 4.8, reviews: 320,
    locationLabel: 'Casablanca, Maroc', instantBooking: true, digitalKey: false,
    badge: 'SUV',
  },
  {
    id: 'v2', category: 'suv', ownerKind: 'individual', ownerName: 'Sarah M.',
    make: 'Audi', model: 'Q5', version: '40 TDI Quattro', year: 2022,
    seats: 5, transmission: 'auto', fuel: 'diesel',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/2018_Volkswagen_Golf_SE_Navigation_TSi_BlueMotion_1.0_Front.jpg',
    priceDayMinor: 7500, currency: 'EUR', rating: 4.7, reviews: 248,
    locationLabel: 'Rabat, Maroc', instantBooking: true, digitalKey: false,
    badge: 'SUV',
  },
  {
    id: 'v3', category: 'berline', ownerKind: 'professional', ownerName: 'Auto Premium Pro',
    make: 'BMW', model: 'Série 3', version: '320d', year: 2021,
    seats: 5, transmission: 'auto', fuel: 'diesel',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Peugeot_208_(2022).jpg',
    priceDayMinor: 6500, currency: 'EUR', rating: 4.6, reviews: 196,
    locationLabel: 'Marrakech, Maroc', instantBooking: false, digitalKey: false,
    badge: 'Berline',
  },
  {
    id: 'v4', category: 'citadine', ownerKind: 'individual', ownerName: 'Karim P.',
    make: 'Peugeot', model: '208', version: 'Active Pack', year: 2022,
    seats: 5, transmission: 'manual', fuel: 'petrol',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/2016_Yamaha_Mio_M3_125_(20200720).jpg',
    priceDayMinor: 3900, currency: 'EUR', rating: 4.9, reviews: 58,
    locationLabel: 'Tanger, Maroc', instantBooking: true, digitalKey: false,
    badge: 'Citadine',
  },
  {
    id: 'v5', category: 'moto', ownerKind: 'individual', ownerName: 'Anas T.',
    make: 'Yamaha', model: 'MT-07', version: null, year: 2023,
    seats: 2, transmission: 'manual', fuel: 'petrol',
    photo: null, priceDayMinor: 4200, currency: 'EUR', rating: 4.5, reviews: 21,
    locationLabel: 'Agadir, Maroc', instantBooking: true, digitalKey: false,
    badge: 'Moto',
  },
  {
    id: 'v6', category: 'trottinette', ownerKind: 'individual', ownerName: 'Lina F.',
    make: 'Xiaomi', model: 'Electric Scooter 4 Pro', version: null, year: 2024,
    seats: 1, transmission: 'auto', fuel: 'electric',
    photo: null, priceDayMinor: 1200, currency: 'EUR', rating: 4.4, reviews: 12,
    locationLabel: 'Casablanca, Maroc', instantBooking: true, digitalKey: false,
    badge: 'Trottinette',
  },
  {
    id: 'v7', category: 'velo', ownerKind: 'individual', ownerName: 'Omar Z.',
    make: 'Decathlon', model: 'Riverside 500', version: null, year: 2023,
    seats: 1, transmission: null, fuel: null,
    photo: null, priceDayMinor: 900, currency: 'EUR', rating: 4.8, reviews: 9,
    locationLabel: 'Rabat, Maroc', instantBooking: true, digitalKey: false,
    badge: 'Vélo',
  },
  {
    id: 'v8', category: 'yacht', ownerKind: 'professional', ownerName: 'Riviera Yachting',
    make: 'Beneteau', model: 'Gran Turismo 40', version: null, year: 2020,
    seats: 10, transmission: null, fuel: null,
    photo: null, priceDayMinor: 120000, currency: 'EUR', rating: 4.9, reviews: 14,
    locationLabel: 'Tanger Marina, Maroc', instantBooking: false, digitalKey: false,
    badge: 'Yacht', premium: true,
  },
  {
    id: 'v9', category: 'jet_prive', ownerKind: 'professional', ownerName: 'SkyOne Aviation',
    make: 'Cessna', model: 'Citation CJ3', version: null, year: 2019,
    seats: 8, transmission: null, fuel: null,
    photo: null, priceDayMinor: 450000, currency: 'EUR', rating: 5.0, reviews: 6,
    locationLabel: 'Aéroport Mohammed V, Casablanca', instantBooking: false, digitalKey: false,
    badge: 'Jet privé', premium: true,
  },
  {
    id: 'v10', category: 'utilitaire', ownerKind: 'platform_fleet', ownerName: 'CAR ONE PLUS',
    make: 'Renault', model: 'Trafic', version: 'Fourgon L2H1', year: 2023,
    seats: 3, transmission: 'manual', fuel: 'diesel',
    photo: null, priceDayMinor: 5500, currency: 'MAD', rating: 4.7, reviews: 41,
    locationLabel: 'Casablanca, Maroc', instantBooking: true, digitalKey: false,
    badge: 'Utilitaire', fleet: true,
  },
  {
    id: 'v11', category: 'camion', ownerKind: 'platform_fleet', ownerName: 'CAR ONE PLUS',
    make: 'Iveco', model: 'Daily', version: 'Benne 35C', year: 2022,
    seats: 3, transmission: 'manual', fuel: 'diesel',
    photo: null, priceDayMinor: 9000, currency: 'MAD', rating: 4.6, reviews: 17,
    locationLabel: 'Casablanca, Maroc', instantBooking: true, digitalKey: false,
    badge: 'Camion', fleet: true,
  },
];

export function getVehicleById(id) {
  return DEMO_VEHICLES.find((v) => v.id === id) || null;
}

export function searchVehicles({ categories = [], query = '' } = {}) {
  return DEMO_VEHICLES.filter((v) => {
    const matchesCategory = categories.length === 0 || categories.includes(v.category);
    const haystack = `${v.make} ${v.model} ${v.locationLabel}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });
}
