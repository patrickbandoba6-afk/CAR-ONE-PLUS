import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEMO_USER, DEMO_BOOKINGS } from '../data/demoUser';
import { DEMO_BOOKING_REQUESTS } from '../data/bookingRequests';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { fetchMyProfile, signOutRemote } from '../lib/api/auth';

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [user, setUser] = useState(DEMO_USER);
  // authStatus est la SEULE source de vérité pour "l'utilisateur est-il
  // connecté" — dérivé de la session Supabase réelle (ou de l'état démo
  // local si Supabase n'est pas configuré), jamais d'un simple flag écran.
  // accountType ('individual' | 'professional') est dérivé de user.accountType,
  // lui-même fixé UNE SEULE FOIS à l'inscription et jamais modifiable ensuite
  // depuis l'app (voir SignupScreen.js, IdentityVerificationScreen.js).
  // C'est cette paire qui décide, dans AppNavigator.js, laquelle des trois
  // arborescences de navigation (Auth / Particulier / Professionnel) est
  // montée — les deux espaces ne partagent donc plus aucune route active.
  const [authStatus, setAuthStatus] = useState('loading'); // loading | signedOut | signedIn
  // true juste après une inscription tant que le KYC/KYB n'a pas été complété
  // ou explicitement repoussé — pilote l'écran de démarrage de l'espace
  // fraîchement monté (voir AppNavigator.js).
  const [pendingIdentityVerification, setPendingIdentityVerification] = useState(false);
  const accountType = user?.accountType === 'professional' ? 'professional' : 'individual';
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

  // Restauration de session au démarrage — c'est le SEUL endroit qui décide
  // "l'utilisateur est connecté" et "avec quel type de compte". En mode
  // Supabase réel, account_type vient de la table `profiles` (jamais d'un
  // état client) ; sans Supabase configuré, l'app reste en mode démo local
  // et démarre déconnectée (écran de connexion/inscription).
  useEffect(() => {
    let active = true;
    (async () => {
      if (!isSupabaseConfigured) {
        if (active) setAuthStatus('signedOut');
        return;
      }
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      if (!session) {
        if (active) setAuthStatus('signedOut');
        return;
      }
      const profile = await fetchMyProfile(session.user.id);
      if (!active) return;
      if (profile) {
        setUser((prev) => ({ ...prev, ...profile, email: session.user.email || profile.email }));
        setAuthStatus('signedIn');
      } else {
        // Session Supabase valide mais aucun profil applicatif (cas limite,
        // ex. inscription interrompue avant écriture de `profiles`) — on ne
        // laisse jamais entrer dans un espace sans account_type confirmé.
        setAuthStatus('signedOut');
      }
    })();
    return () => { active = false; };
  }, []);

  // Déconnexion réelle — invalide la session Supabase (si configurée) puis
  // réinitialise tout l'état local. C'est le seul chemin légitime pour
  // changer d'espace (voir mission "séparation des espaces", §9) : il n'y a
  // aucune bascule directe particulier <-> professionnel dans l'app.
  const signOut = async () => {
    if (isSupabaseConfigured) await signOutRemote();
    resetDemoState();
  };

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
  // strokes : signature tracée à l'instant, sur CE contrat précis (voir le
  // modal de signature dans ContractScreen.js) — ne réutilise plus jamais
  // silencieusement l'ancienne signature enregistrée au KYC ; si absente,
  // on retombe sur `signature` (compat écrans existants).
  const signContract = (id, role, strokes) => setContracts((prev) => prev.map((c) => {
    if (c.id !== id) return c;
    const next = {
      ...c,
      [`${role}SignedAt`]: new Date().toISOString(),
      [`${role}Signature`]: strokes && strokes.length > 0 ? strokes : signature,
      [`${role}DocumentUri`]: null,
    };
    next.status = next.renterSignedAt && next.ownerSignedAt ? 'completed' : role === 'renter' ? 'pending_owner' : 'pending_renter';
    return next;
  }));

  // Alternative à la signature manuscrite : le client télécharge le contrat,
  // le signe en dehors de l'app (papier + photo, ou une appli tierce), puis
  // rajoute directement ce document signé ici — il reste attaché au contrat,
  // consultable à tout moment depuis l'application (voir ContractScreen.js).
  const attachContractDocument = (id, role, uri) => setContracts((prev) => prev.map((c) => {
    if (c.id !== id) return c;
    const next = {
      ...c,
      [`${role}SignedAt`]: new Date().toISOString(),
      [`${role}DocumentUri`]: uri,
      [`${role}Signature`]: null,
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

  // Réinitialise l'état local (déconnexion / suppression de compte). Remet
  // aussi `user` et `authStatus` à zéro : après une déconnexion, plus aucune
  // trace du compte précédent (type inclus) ne doit subsister — voir mission
  // "séparation des espaces" §9 (changer d'espace exige un nouveau compte).
  const resetDemoState = () => {
    setUser(DEMO_USER);
    setAuthStatus('signedOut');
    setPendingIdentityVerification(false);
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
  };

  const value = useMemo(() => ({
    user, setUser,
    authStatus, setAuthStatus, accountType, signOut,
    pendingIdentityVerification, setPendingIdentityVerification,
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
    contracts, createContract, signContract, attachContractDocument,
    myListings, addListing, updateListing, removeListing,
    bookingRequests, respondToBookingRequest,
    collaborators, addCollaborator, removeCollaborator,
    claims, addClaim, updateClaim,
    inspections, addInspection,
    sessionStartedAt,
    resetDemoState,
  }), [user, authStatus, accountType, pendingIdentityVerification, favorites, bookings, searchFilters, bookingDraft, listingDraft, documents, drivers, paymentMethods, notificationPrefs, twoFactorEnabled, loyaltyPoints, signature, contracts, myListings, bookingRequests, collaborators, claims, inspections, sessionStartedAt]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
