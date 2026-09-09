import React, { createContext, useContext, useMemo, useState } from 'react';
import { DEMO_USER, DEMO_BOOKINGS } from '../data/demoUser';

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

  const toggleFavorite = (vehicleId) => {
    setFavorites((prev) => (prev.includes(vehicleId) ? prev.filter((id) => id !== vehicleId) : [...prev, vehicleId]));
  };

  const value = useMemo(() => ({
    user, setUser, mode, setMode,
    favorites, toggleFavorite,
    bookings, setBookings,
    searchFilters, setSearchFilters,
    bookingDraft, setBookingDraft,
    listingDraft, setListingDraft,
  }), [user, mode, favorites, bookings, searchFilters, bookingDraft, listingDraft]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
