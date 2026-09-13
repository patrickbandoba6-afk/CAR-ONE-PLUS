import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import { fetchVehiclesByIds } from '../../lib/api/vehicles';
import { formatMoney, formatDate } from '../../utils/format';
import { useAppState } from '../../context/AppStateContext';

export default function OwnerBookingsScreen({ navigation }) {
  const { t } = useTranslation();
  const { bookings, setBookings, bookingRequests, respondToBookingRequest } = useAppState();
  const [vehiclesById, setVehiclesById] = useState({});
  const pendingRequests = bookingRequests.filter((r) => r.status === 'pending');

  useEffect(() => {
    let active = true;
    const ids = [...bookings.map((b) => b.vehicleId), ...bookingRequests.map((r) => r.listingId)];
    fetchVehiclesByIds(ids).then((map) => { if (active) setVehiclesById(map); });
    return () => { active = false; };
  }, [bookings, bookingRequests]);

  const respond = (id, status) => setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <FlatList
        data={bookings}
        keyExtractor={(b) => b.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>{t('owner.bookings')}</Text>
            {pendingRequests.length > 0 && (
              <View style={{ gap: 12, marginBottom: 20 }}>
                <Text style={styles.sectionTitle}>Demandes en attente</Text>
                {pendingRequests.map((item) => {
                  const vehicle = vehiclesById[item.listingId];
                  return (
                    <View key={item.id} style={styles.requestCard}>
                      <Pressable style={styles.requesterTop} onPress={() => navigation.navigate('RequesterProfile', { requestId: item.id, requesterId: item.requesterId })}>
                        <View style={styles.avatar}><Ionicons name="person" size={16} color={colors.gold} /></View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.requesterName}>{item.requesterName}</Text>
                          <Text style={styles.dates}>{vehicle ? `${vehicle.make} ${vehicle.model} · ` : ''}{formatDate(item.startsAt)} → {formatDate(item.endsAt)}</Text>
                        </View>
                        <Text style={styles.total}>{formatMoney(item.priceMinor, item.currency)}</Text>
                        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                      </Pressable>
                      <View style={styles.actionsRow}>
                        <Pressable style={[styles.actionBtn, styles.decline]} onPress={() => respondToBookingRequest(item.id, 'declined')}><Text style={styles.declineText}>Refuser</Text></Pressable>
                        <Pressable style={[styles.actionBtn, styles.accept]} onPress={() => respondToBookingRequest(item.id, 'accepted')}><Text style={styles.acceptText}>Accepter</Text></Pressable>
                      </View>
                    </View>
                  );
                })}
                <Text style={styles.sectionTitle}>Réservations confirmées</Text>
              </View>
            )}
          </>
        }
        ListEmptyComponent={<Text style={styles.empty}>Aucune réservation confirmée pour l'instant.</Text>}
        renderItem={({ item }) => {
          const vehicle = vehiclesById[item.vehicleId];
          if (!vehicle) return null;
          return (
            <View style={styles.card}>
              <Text style={styles.vehicleName}>{vehicle.make} {vehicle.model}</Text>
              <Text style={styles.dates}>{formatDate(item.startsAt)} → {formatDate(item.endsAt)}</Text>
              <Text style={styles.total}>{formatMoney(item.totalMinor, item.currency)}</Text>
              {item.deliveryAddress && (
                <View style={styles.deliveryRow}>
                  <Ionicons name="bicycle-outline" size={14} color={colors.gold} />
                  <Text style={styles.deliveryText}>À livrer : {item.deliveryAddress}</Text>
                </View>
              )}
              {item.status === 'pending_approval' && (
                <View style={styles.actionsRow}>
                  <Pressable style={[styles.actionBtn, styles.decline]} onPress={() => respond(item.id, 'cancelled')}><Text style={styles.declineText}>Refuser</Text></Pressable>
                  <Pressable style={[styles.actionBtn, styles.accept]} onPress={() => respond(item.id, 'confirmed')}><Text style={styles.acceptText}>Accepter</Text></Pressable>
                </View>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { ...typography.h1, marginBottom: 16 },
  sectionTitle: { ...typography.h3, fontSize: 14, color: colors.gold },
  empty: { ...typography.bodyMuted, textAlign: 'center', marginTop: 40 },
  card: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 16, gap: 4 },
  requestCard: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.gold, padding: 14, gap: 10 },
  requesterTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' },
  requesterName: { ...typography.body, fontWeight: '700' },
  vehicleName: { ...typography.h3 },
  dates: { ...typography.caption },
  total: { color: colors.gold, fontWeight: '700', marginTop: 4 },
  deliveryRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  deliveryText: { ...typography.caption, color: colors.textSecondary, flexShrink: 1 },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  actionBtn: { flex: 1, height: 38, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  decline: { borderWidth: 1, borderColor: colors.cardBorder },
  declineText: { color: colors.textSecondary, fontWeight: '700', fontSize: 13 },
  accept: { backgroundColor: colors.gold },
  acceptText: { color: colors.bg, fontWeight: '700', fontSize: 13 },
});
