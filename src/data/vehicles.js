// Catalogue de démonstration — permet de naviguer l'app hors connexion Supabase.
// En production, ces enregistrements vivent dans les tables vehicles/listings (voir supabase/schema.sql).
export const DEMO_VEHICLES = [
  {
    id: 'v1', category: 'suv', ownerKind: 'individual', ownerName: 'Yassine B.',
    make: 'Mercedes', model: 'GLE', version: '300d 4MATIC', year: 2023,
    seats: 5, transmission: 'auto', fuel: 'diesel',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Mercedes-Benz_GLE_350_d_4MATIC_AMG_Line_%28V_167%29_%E2%80%93_f_09022020.jpg',
    priceDayMinor: 8900, currency: 'EUR', rating: 4.8, reviews: 320,
    locationLabel: 'Casablanca, Maroc', lat: 33.5731, lng: -7.5898, instantBooking: true, digitalKey: false,
    includedKmPerDay: 250, extraKmPriceMinor: 45,
    badge: 'SUV',
  },
  {
    id: 'v2', category: 'suv', ownerKind: 'individual', ownerName: 'Sarah M.',
    make: 'Audi', model: 'Q5', version: '40 TDI Quattro', year: 2022,
    seats: 5, transmission: 'auto', fuel: 'diesel',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Audi_Q5_Facelift_S_line_2.0_TFSI_quattro_tiptronic_Daytonagrau.JPG',
    priceDayMinor: 7500, currency: 'EUR', rating: 4.7, reviews: 248,
    locationLabel: 'Rabat, Maroc', lat: 34.0209, lng: -6.8416, instantBooking: true, digitalKey: false,
    includedKmPerDay: 250, extraKmPriceMinor: 45,
    badge: 'SUV',
  },
  {
    id: 'v3', category: 'berline', ownerKind: 'professional', ownerName: 'Auto Premium Pro',
    make: 'BMW', model: 'Série 3', version: '320d', year: 2021,
    seats: 5, transmission: 'auto', fuel: 'diesel',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/2/29/BMW_3_Series_%28G20%29.jpg',
    priceDayMinor: 6500, currency: 'EUR', rating: 4.6, reviews: 196,
    locationLabel: 'Marrakech, Maroc', lat: 31.6295, lng: -7.9811, instantBooking: false, digitalKey: false,
    includedKmPerDay: 250, extraKmPriceMinor: 40,
    badge: 'Berline',
  },
  {
    id: 'v4', category: 'citadine', ownerKind: 'individual', ownerName: 'Karim P.',
    make: 'Peugeot', model: '208', version: 'Active Pack', year: 2022,
    seats: 5, transmission: 'manual', fuel: 'petrol',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/2020_Peugeot_208_GT_Line_PureTech_1.2_Front.jpg',
    priceDayMinor: 3900, currency: 'EUR', rating: 4.9, reviews: 58,
    locationLabel: 'Tanger, Maroc', lat: 35.7595, lng: -5.8340, instantBooking: true, digitalKey: false,
    includedKmPerDay: 200, extraKmPriceMinor: 30,
    badge: 'Citadine',
  },
  {
    id: 'v5', category: 'moto', ownerKind: 'individual', ownerName: 'Anas T.',
    make: 'Yamaha', model: 'MT-07', version: null, year: 2023,
    seats: 2, transmission: 'manual', fuel: 'petrol',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Yamaha_MT-07.jpg', priceDayMinor: 4200, currency: 'EUR', rating: 4.5, reviews: 21,
    locationLabel: 'Agadir, Maroc', lat: 30.4278, lng: -9.5981, instantBooking: true, digitalKey: false,
    includedKmPerDay: 150, extraKmPriceMinor: 25,
    badge: 'Moto',
  },
  {
    id: 'v6', category: 'trottinette', ownerKind: 'individual', ownerName: 'Lina F.',
    make: 'Xiaomi', model: 'Electric Scooter 4 Pro', version: null, year: 2024,
    seats: 1, transmission: 'auto', fuel: 'electric',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Xiaomi_Mi_3_blanche.jpg', priceDayMinor: 1200, currency: 'EUR', rating: 4.4, reviews: 12,
    locationLabel: 'Casablanca, Maroc', lat: 33.5931, lng: -7.6000, instantBooking: true, digitalKey: false,
    includedKmPerDay: 30, extraKmPriceMinor: 15,
    badge: 'Trottinette',
  },
  {
    id: 'v7', category: 'velo', ownerKind: 'individual', ownerName: 'Omar Z.',
    make: 'Decathlon', model: 'Riverside 500', version: null, year: 2023,
    seats: 1, transmission: null, fuel: null,
    photo: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Decathlon_Riverside_920.jpg', priceDayMinor: 900, currency: 'EUR', rating: 4.8, reviews: 9,
    locationLabel: 'Rabat, Maroc', lat: 34.0359, lng: -6.8300, instantBooking: true, digitalKey: false,
    includedKmPerDay: null, extraKmPriceMinor: null,
    badge: 'Vélo',
  },
  {
    id: 'v8', category: 'yacht', ownerKind: 'professional', ownerName: 'Riviera Yachting',
    make: 'Beneteau', model: 'Gran Turismo 40', version: null, year: 2020,
    seats: 10, transmission: null, fuel: null,
    photo: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Benetau.jpg', priceDayMinor: 120000, currency: 'EUR', rating: 4.9, reviews: 14,
    locationLabel: 'Tanger Marina, Maroc', lat: 35.7880, lng: -5.8129, instantBooking: false, digitalKey: false,
    includedKmPerDay: null, extraKmPriceMinor: null,
    badge: 'Yacht', premium: true,
  },
  {
    id: 'v9', category: 'jet_prive', ownerKind: 'professional', ownerName: 'SkyOne Aviation',
    make: 'Cessna', model: 'Citation CJ3', version: null, year: 2019,
    seats: 8, transmission: null, fuel: null,
    photo: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Cessna_525B_Citation_CJ3.jpg', priceDayMinor: 450000, currency: 'EUR', rating: 5.0, reviews: 6,
    locationLabel: 'Aéroport Mohammed V, Casablanca', lat: 33.3675, lng: -7.5900, instantBooking: false, digitalKey: false,
    includedKmPerDay: null, extraKmPriceMinor: null,
    badge: 'Jet privé', premium: true,
  },
  {
    id: 'v12', category: 'compacte', ownerKind: 'individual', ownerName: 'Nadia E.',
    make: 'Volkswagen', model: 'Golf', version: '1.5 TSI', year: 2022,
    seats: 5, transmission: 'manual', fuel: 'petrol',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/2020_Volkswagen_Golf_Style_1.5_Front.jpg', priceDayMinor: 4500, currency: 'EUR', rating: 4.7, reviews: 88,
    locationLabel: 'Fès, Maroc', lat: 34.0331, lng: -5.0003, instantBooking: true, digitalKey: false,
    includedKmPerDay: 200, extraKmPriceMinor: 30,
    badge: 'Compacte',
  },
  {
    id: 'v13', category: 'premium', ownerKind: 'professional', ownerName: 'Prestige Cars',
    make: 'Mercedes', model: 'Classe E', version: '350d AMG Line', year: 2023,
    seats: 5, transmission: 'auto', fuel: 'diesel',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Mercedes_E_class_W213_Exclusive_black_%281%29.jpg', priceDayMinor: 11000, currency: 'EUR', rating: 4.9, reviews: 64,
    locationLabel: 'Casablanca, Maroc', lat: 33.5580, lng: -7.5700, instantBooking: false, digitalKey: false,
    includedKmPerDay: 200, extraKmPriceMinor: 50,
    badge: 'Premium',
  },
  {
    id: 'v14', category: 'luxe', ownerKind: 'professional', ownerName: 'Prestige Cars',
    make: 'Porsche', model: 'Panamera', version: '4S', year: 2023,
    seats: 4, transmission: 'auto', fuel: 'petrol',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Porsche_Panamera_4S.jpg', priceDayMinor: 32000, currency: 'EUR', rating: 5.0, reviews: 22,
    locationLabel: 'Marrakech, Maroc', lat: 31.6395, lng: -7.9960, instantBooking: false, digitalKey: false,
    includedKmPerDay: 150, extraKmPriceMinor: 60,
    badge: 'Luxe',
  },
  {
    id: 'v15', category: 'electrique', ownerKind: 'individual', ownerName: 'Hicham L.',
    make: 'Tesla', model: 'Model 3', version: 'Long Range', year: 2023,
    seats: 5, transmission: 'auto', fuel: 'electric',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/2021_Tesla_Model_3.jpg', priceDayMinor: 9500, currency: 'EUR', rating: 4.8, reviews: 71,
    locationLabel: 'Rabat, Maroc', lat: 34.0109, lng: -6.8266, instantBooking: true, digitalKey: false,
    includedKmPerDay: 250, extraKmPriceMinor: 35,
    badge: 'Électrique',
  },
  {
    id: 'v16', category: 'scooter', ownerKind: 'individual', ownerName: 'Salma K.',
    make: 'Yamaha', model: 'XMAX 300', version: null, year: 2022,
    seats: 2, transmission: 'auto', fuel: 'petrol',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/2024_Yamaha_XMAX_300_Tech_MAX.jpg', priceDayMinor: 3200, currency: 'EUR', rating: 4.6, reviews: 33,
    locationLabel: 'Casablanca, Maroc', lat: 33.6031, lng: -7.5750, instantBooking: true, digitalKey: false,
    includedKmPerDay: 100, extraKmPriceMinor: 20,
    badge: 'Scooter',
  },
  {
    id: 'v17', category: 'fourgon', ownerKind: 'platform_fleet', ownerName: 'CAR ONE PLUS',
    make: 'Mercedes', model: 'Sprinter', version: 'Fourgon L3H2', year: 2023,
    seats: 3, transmission: 'manual', fuel: 'diesel',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/2010_Mercedes-Benz_Sprinter_2500_Cargo_Van_%28W906%29.jpg', priceDayMinor: 7000, currency: 'MAD', rating: 4.7, reviews: 19,
    locationLabel: 'Casablanca, Maroc', lat: 33.5531, lng: -7.6100, instantBooking: true, digitalKey: false,
    includedKmPerDay: 150, extraKmPriceMinor: 40,
    badge: 'Fourgon', fleet: true,
  },
  {
    id: 'v18', category: 'aeronef', ownerKind: 'professional', ownerName: 'AtlasAir Charter',
    make: 'Beechcraft', model: 'King Air 350', version: null, year: 2018,
    seats: 9, transmission: null, fuel: null,
    photo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Australian_Beechcraft_B300_King_Air_350.JPG', priceDayMinor: 280000, currency: 'EUR', rating: 4.8, reviews: 5,
    locationLabel: 'Aéroport Menara, Marrakech', lat: 31.6069, lng: -8.0363, instantBooking: false, digitalKey: false,
    badge: 'Avion', premium: true,
  },
  {
    id: 'v10', category: 'utilitaire', ownerKind: 'platform_fleet', ownerName: 'CAR ONE PLUS',
    make: 'Renault', model: 'Trafic', version: 'Fourgon L2H1', year: 2023,
    seats: 3, transmission: 'manual', fuel: 'diesel',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/3/39/2004-2007_Renault_Trafic_%28X83%29_low_roof_van_02.jpg', priceDayMinor: 5500, currency: 'MAD', rating: 4.7, reviews: 41,
    locationLabel: 'Casablanca, Maroc', lat: 33.5831, lng: -7.5600, instantBooking: true, digitalKey: false,
    includedKmPerDay: 150, extraKmPriceMinor: 35,
    badge: 'Utilitaire', fleet: true,
  },
  {
    id: 'v11', category: 'camion', ownerKind: 'platform_fleet', ownerName: 'CAR ONE PLUS',
    make: 'Iveco', model: 'Daily', version: 'Benne 35C', year: 2022,
    seats: 3, transmission: 'manual', fuel: 'diesel',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Iveco_Daily_35C15_truck_%281%29.jpg', priceDayMinor: 9000, currency: 'MAD', rating: 4.6, reviews: 17,
    locationLabel: 'Casablanca, Maroc', lat: 33.5431, lng: -7.5800, instantBooking: true, digitalKey: false,
    includedKmPerDay: 100, extraKmPriceMinor: 50,
    badge: 'Camion', fleet: true,
  },
];

export function getVehicleById(id) {
  return DEMO_VEHICLES.find((v) => v.id === id) || null;
}

export function searchVehicles({ categories = [], query = '', instantBookingOnly = false } = {}) {
  return DEMO_VEHICLES.filter((v) => {
    const matchesCategory = categories.length === 0 || categories.includes(v.category);
    const haystack = `${v.make} ${v.model} ${v.locationLabel}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query.toLowerCase());
    const matchesInstant = !instantBookingOnly || v.instantBooking;
    return matchesCategory && matchesQuery && matchesInstant;
  });
}
