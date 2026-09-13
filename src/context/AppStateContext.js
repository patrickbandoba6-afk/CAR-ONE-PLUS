import React, { createContext, useContext, useMemo, useState } from 'react';
import { DEMO_USER, DEMO_BOOKINGS } from '../data/demoUser';
import { DEMO_BOOKING_REQUESTS } from '../data/bookingRequests';

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [user, setUser] = useState(DEMO_USER);
  const [mode, setMode] = useState('renter'); // renter | owner | professional
  const [favorites, setFavorites] = useState([]);
  const [bookings, setBookings] = useState(DEMO_BOOKINGS);
  const [searchFilters, setSearchFilters] = useState({
    categories: [], query: '', startAt: null, endAt: null,
    priceMax: null, transmission: null, fuel: null, instantBookingOnly: false,
  });
  const [bookingDraft, setBookingDraft] = useState(null);
  const [listingDraft, setListingDraft] = useState(null);

  // Documents personnels (pièce d'identité, permis...) — { [docKey]: { uri, addedAt } }
  const [documents, setDocuments] = useState({});
  // Conducteurs autorisés additionnels (hors titulaire du compte)
  const [drivers, setDrivers] = useState([]);
  // Moyens de paiement démo (aucun PSP réel branché — voir 04_ARCHITECTURE_TECHNIQUE.md)
  const [paymentMethods, setPaymentMethods] = useState([{ id: 'pm-demo', brand: 'Visa', last4: '4242' }]);
  const [notificationPrefs, setNotificationPrefs] = useState({ reservations: true, messages: true, promotions: false, security: true });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionStartedAt] = useState(() => new Date().toISOString());
  // Fidélité cross-catégorie — 1 point par euro dépensé, valable sur toutes
  // les catégories (vélo → jet privé), voir LoyaltyScreen.js. Seedé à 380 pour
  // refléter l'historique de réservations démo (DEMO_BOOKINGS).
  const [loyaltyPoints, setLoyaltyPoints] = useState(380);
  // Signature manuscrite enregistrée au KYC — requise pour signer un contrat
  // en tant que locataire ou propriétaire (voir SignaturePad.js).
  const [signature, setSignature] = useState(null);
  // Contrats de location — générés automatiquement à chaque paiement confirmé,
  // exigent la signature des deux parties (voir ContractScreen.js).
  const [contracts, setContracts] = useState([]);
  // Biens publiés par un compte professionnel (tous types : véhicules, avions,
  // yachts...) — voir FleetScreen.js. Distinct du catalogue démo DEMO_VEHICLES.
  const [myListings, setMyListings] = useState([]);
  // Demandes de réservation multiples sur un bien — le professionnel choisit
  // à qui il l'accorde (voir ProBookingsScreen.js, data/bookingRequests.js).
  const [bookingRequests, setBookingRequests] = useState(DEMO_BOOKING_REQUESTS);
  // Membres de l'équipe d'un compte professionnel (rôles alignés sur
  // organization_members dans supabase/schema.sql).
  const [collaborators, setCollaborators] = useState([]);
  // Sinistres déclarés sur un bien — chaque déclaration garde les photos du
  // constat (voir ClaimsScreen.js).
  const [claims, setClaims] = useState([]);
  // États des lieux (check-in/check-out) — une entrée par réservation+phase,
  // avec la vraie photo prise pour chaque zone du véhicule (voir
  // CheckInOutScreen.js, miroir de la table `inspections` du schéma Supabase).
  const [inspections, setInspections] = useState([]);

  const toggleFavorite = (vehicleId) => {
    setFavorites((prev) => (prev.includes(vehicleId) ? prev.filter((id) => id !== vehicleId) : [...prev, vehicleId]));
  };

  const addDocument = (key, uri) => setDocuments((prev) => ({ ...prev, [key]: { uri, addedAt: new Date().toISOString() } }));
  const removeDocument = (key) => setDocuments((prev) => { const next = { ...prev }; delete next[key]; return next; });
  const addDriver = (driver) => setDrivers((prev) => [...prev, { id: `drv-${Date.now()}`, ...driver }]);
  const removeDriver = (id) => setDrivers((prev) => prev.filter((d) => d.id !== id));
  const addPaymentMethod = (method) => setPaymentMethods((prev) => [...prev, { id: `pm-${Date.now()}`, ...method }]);
  const removePaymentMethod = (id) => setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
  const addLoyaltyPoints = (amount) => setLoyaltyPoints((prev) => prev + Math.max(0, Math.round(amount)));

  // ---- Contrats ----------------------------------------------------------
  // Créé automatiquement à la confirmation d'un paiement (PaymentScreen) —
  // le locataire est considéré signé immédiatement s'il a déjà une signature
  // enregistrée, le propriétaire signe ensuite depuis ses contrats.
  const createContract = (contract) => {
    const id = `ctr-${Date.now()}`;
    setContracts((prev) => [{ id, ...contract }, ...prev]);
    return id;
  };
  const signContract = (id, role) => setContracts((prev) => prev.map((c) => {
    if (c.id !== id) return c;
    const next = {
      ...c,
      [`${role}SignedAt`]: new Date().toISOString(),
      [`${role}Signature`]: signature,
    };
    next.status = next.renterSignedAt && next.ownerSignedAt ? 'completed' : role === 'renter' ? 'pending_owner' : 'pending_renter';
    return next;
  }));

  // ---- Flotte professionnelle ---------------------------------------------
  const addListing = (listing) => {
    const id = `lst-${Date.now()}`;
    setMyListings((prev) => [{ id, status: 'active', createdAt: new Date().toISOString(), ...listing }, ...prev]);
    return id;
  };
  const updateListing = (id, patch) => setMyListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const removeListing = (id) => setMyListings((prev) => prev.filter((l) => l.id !== id));

  // ---- Demandes de réservation (propositions multiples) -------------------
  // Accepter une demande refuse automatiquement les autres demandes en attente
  // sur le même bien — un propriétaire n'accorde son bien qu'à une personne.
  const respondToBookingRequest = (id, status) => setBookingRequests((prev) => {
    const target = prev.find((r) => r.id === id);
    if (!target) return prev;
    return prev.map((r) => {
      if (r.id === id) return { ...r, status };
      if (status === 'accepted' && r.listingId === target.listingId && r.status === 'pending') return { ...r, status: 'declined' };
      return r;
    });
  });

  // ---- Collaborateurs -------------------------------------------------------
  const addCollaborator = (collaborator) => setCollaborators((prev) => [...prev, { id: `col-${Date.now()}`, ...collaborator }]);
  const removeCollaborator = (id) => setCollaborators((prev) => prev.filter((c) => c.id !== id));

  // ---- Sinistres -------------------------------------------------------------
  const addClaim = (claim) => {
    const id = `clm-${Date.now()}`;
    setClaims((prev) => [{ id, status: 'open', createdAt: new Date().toISOString(), photos: [], ...claim }, ...prev]);
    return id;
  };
  const updateClaim = (id, patch) => setClaims((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  // ---- États des lieux -------------------------------------------------------
  const addInspection = (inspection) => {
    const id = `insp-${Date.now()}`;
    setInspections((prev) => [{ id, completedAt: new Date().toISOString(), ...inspection }, ...prev]);
    return id;
  };

  // Réinitialise l'état démo local (déconnexion / suppression de compte) —
  // aucune donnée serveur réelle n'existe encore (mode démo tant que Supabase
  // n'est pas configuré), donc "supprimer mon compte" ne peut agir que sur cet état local.
  const resetDemoState = () => {
    setFavorites([]);
    setBookings(DEMO_BOOKINGS);
    setBookingDraft(null);
    setListingDraft(null);
    setDocuments({});
    setDrivers([]);
    setPaymentMethods([{ id: 'pm-demo', brand: 'Visa', last4: '4242' }]);
    setNotificationPrefs({ reservations: true, messages: true, promotions: false, security: true });
    setTwoFactorEnabled(false);
    setLoyaltyPoints(0);
    setSignature(null);
    setContracts([]);
    setMyListings([]);
    setBookingRequests(DEMO_BOOKING_REQUESTS);
    setCollaborators([]);
    setClaims([]);
    setInspections([]);
    setMode('renter');
  };

  const value = useMemo(() => ({
    user, setUser, mode, setMode,
    favorites, toggleFavorite,
    bookings, setBookings,
    searchFilters, setSearchFilters,
    bookingDraft, setBookingDraft,
    listingDraft, setListingDraft,
    documents, addDocument, removeDocument,
    drivers, addDriver, removeDriver,
    paymentMethods, addPaymentMethod, removePaymentMethod,
    notificationPrefs, setNotificationPrefs,
    twoFactorEnabled, setTwoFactorEnabled,
    loyaltyPoints, addLoyaltyPoints,
    signature, setSignature,
    contracts, createContract, signContract,
    myListings, addListing, updateListing, removeListing,
    bookingRequests, respondToBookingRequest,
    collaborators, addCollaborator, removeCollaborator,
    claims, addClaim, updateClaim,
    inspections, addInspection,
    sessionStartedAt,
    resetDemoState,
  }), [user, mode, favorites, bookings, searchFilters, bookingDraft, listingDraft, documents, drivers, paymentMethods, notificationPrefs, twoFactorEnabled, loyaltyPoints, signature, contracts, myListings, bookingRequests, collaborators, claims, inspections, sessionStartedAt]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
