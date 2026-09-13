import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii } from '../../theme/colors';
import { CATEGORIES, CATEGORY_LABELS } from '../../data/categories';
import { DEMO_VEHICLES } from '../../data/vehicles';
import { useAppState } from '../../context/AppStateContext';
import { formatMoney, formatDate } from '../../utils/format';

// Réservations pro — organisées comme le catalogue (catégorie → bien →
// demandeurs), avec plusieurs propositions possibles par bien : le
// professionnel choisit à qui il l'accorde (voir data/bookingRequests.js,
// respondToBookingRequest dans AppStateContext). Navigation à 3 niveaux gérée
// localement (pas de routes supplémentaires) pour rester rapide à parcourir.
export default function ProBookingsScreen({ navigation }) {
  const { myListings, bookingRequests, respondToBookingRequest } = useAppState();
  const [level, setLevel] = useState('categories'); // categories | items | requesters
  const [activeCategoryGroup, setActiveCategoryGroup] = useState(null);
  const [activeListingId, setActiveListingId] = useState(null);

  const allListings = useMemo(() => [
    ...DEMO_VEHICLES.filter((v) => v.ownerKind !== 'platform_fleet'),
    ...myListings,
  ], [myListings]);

  const listingsById = useMemo(() => Object.fromEntries(allListings.map((l) => [l.id, l])), [allListings]);

  const pendingCountForCategories = (filterCategories) => bookingRequests.filter((r) => {
    const listing = listingsById[r.listingId];
    return r.status === 'pending' && listing && filterCategories.includes(listing.category);
  }).length;

  const pendingCountForListing = (listingId) => bookingRequests.filter((r) => r.listingId === listingId && r.status === 'pending').length;

  const itemsInGroup = activeCategoryGroup ? allListings.filter((l) => activeCategoryGroup.filterCategories.includes(l.category)) : [];
  const requestsForListing = activeListingId ? bookingRequests.filter((r) => r.listingId === activeListingId) : [];
  const activeListing = activeListingId ? listingsById[activeListingId] : null;

  const goBack = () => {
    if (level === 'requesters') { setLevel('items'); setActiveListingId(null); return; }
    if (level === 'items') { setLevel('categories'); setActiveCategoryGroup(null); return; }
    navigation.goBack();
  };

  const titles = { categories: 'Réservations', items: activeCategoryGroup?.label, requesters: activeListing ? `${activeListing.make} ${activeListing.model}` : '' };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={goBack}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>{titles[level]}</Text>
        <View style={{ width: 24 }} />
      </View>

      {level === 'categories' && (
        <FlatList
          data={CATEGORIES}
          keyExtractor={(c) => c.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ padding: 20, gap: 12 }}
          renderItem={({ item }) => {
            const count = pendingCountForCategories(item.filterCategories);
            return (
              <Pressable style={styles.catCard} onPress={() => { setActiveCategoryGroup(item); setLevel('items'); }}>
                <Ionicons name={item.icon} size={26} color={colors.gold} />
                <Text style={styles.catLabel}>{item.label}</Text>
                {count > 0 && (
                  <View style={styles.badge}><Text style={styles.badgeText}>{count}</Text></View>
                )}
              </Pressable>
            );
          }}
        />
      )}

      {level === 'items' && (
        <FlatList
          data={itemsInGroup}
          keyExtractor={(l) => l.id}
          contentContainerStyle={{ padding: 20, gap: 12 }}
          ListEmptyComponent={<Text style={styles.empty}>Aucun bien dans cette catégorie.</Text>}
          renderItem={({ item }) => {
            const count = pendingCountForListing(item.id);
            return (
              <Pressable style={styles.itemCard} onPress={() => { setActiveListingId(item.id); setLevel('requesters'); }}>
                <View style={styles.photo}><Ionicons name="car-sport" size={20} color={colors.textMuted} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.make} {item.model}</Text>
                  <Text style={styles.price}>{formatMoney(item.priceDayMinor, item.currency)}/jour</Text>
                </View>
                {count > 0 ? (
                  <View style={styles.badgeInline}><Text style={styles.badgeText}>{count} demande{count > 1 ? 's' : ''}</Text></View>
                ) : (
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                )}
              </Pressable>
            );
          }}
        />
      )}

      {level === 'requesters' && (
        <FlatList
          data={requestsForListing}
          keyExtractor={(r) => r.id}
          contentContainerStyle={{ padding: 20, gap: 12 }}
          ListEmptyComponent={<Text style={styles.empty}>Aucune demande sur ce bien pour l'instant.</Text>}
          renderItem={({ item }) => (
            <View style={styles.requesterCard}>
              <Pressable style={styles.requesterTop} onPress={() => navigation.navigate('RequesterProfile', { requestId: item.id, requesterId: item.requesterId })}>
                <View style={styles.avatar}><Ionicons name="person" size={18} color={colors.gold} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.requesterName}</Text>
                  <Text style={styles.dates}>{formatDate(item.startsAt)} → {formatDate(item.endsAt)}</Text>
                </View>
                <Text style={styles.price}>{formatMoney(item.priceMinor, item.currency)}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </Pressable>
              {item.status === 'pending' ? (
                <View style={styles.actionsRow}>
                  <Pressable style={[styles.actionBtn, styles.decline]} onPress={() => respondToBookingRequest(item.id, 'declined')}><Text style={styles.declineText}>Refuser</Text></Pressable>
                  <Pressable style={[styles.actionBtn, styles.accept]} onPress={() => respondToBookingRequest(item.id, 'accepted')}><Text style={styles.acceptText}>Accepter</Text></Pressable>
                </View>
              ) : (
                <View style={[styles.statusPill, item.status === 'accepted' ? styles.statusAccepted : styles.statusDeclined]}>
                  <Text style={[styles.statusPillText, { color: item.status === 'accepted' ? colors.green : colors.textMuted }]}>
                    {item.status === 'accepted' ? 'Acceptée' : 'Refusée'}
                  </Text>
                </View>
              )}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3, flex: 1, textAlign: 'center' },
  empty: { ...typography.bodyMuted, textAlign: 'center', marginTop: 60 },
  catCard: { flex: 1, aspectRatio: 1, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 8 },
  catLabel: { ...typography.caption, color: colors.textSecondary, textAlign: 'center', fontWeight: '600' },
  badge: { position: 'absolute', top: 10, right: 10, minWidth: 20, height: 20, borderRadius: 10, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeInline: { backgroundColor: colors.red, borderRadius: radii.pill, paddingHorizontal: 10, paddingVertical: 5 },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: '800' },
  itemCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14 },
  photo: { width: 44, height: 44, borderRadius: radii.sm, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' },
  name: { ...typography.body, fontWeight: '700' },
  price: { ...typography.caption, marginTop: 2 },
  requesterCard: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14, gap: 10 },
  requesterTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' },
  dates: { ...typography.caption, marginTop: 2 },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, height: 38, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  decline: { borderWidth: 1, borderColor: colors.cardBorder },
  declineText: { color: colors.textSecondary, fontWeight: '700', fontSize: 13 },
  accept: { backgroundColor: colors.gold },
  acceptText: { color: colors.bg, fontWeight: '700', fontSize: 13 },
  statusPill: { alignSelf: 'flex-start', borderRadius: radii.pill, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1 },
  statusAccepted: { borderColor: colors.green },
  statusDeclined: { borderColor: colors.cardBorder },
  statusPillText: { fontSize: 12, fontWeight: '700' },
});
