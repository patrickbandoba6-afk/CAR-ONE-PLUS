import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import { fetchVehicleById } from '../../lib/api/vehicles';
import { formatMoney, formatDateTime } from '../../utils/format';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppState } from '../../context/AppStateContext';

export default function BookingDetailScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { bookings, contracts } = useAppState();
  const booking = bookings.find((b) => b.id === route.params.bookingId);
  const contract = contracts.find((c) => c.bookingId === route.params.bookingId);
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    if (!booking) return;
    let active = true;
    fetchVehicleById(booking.vehicleId).then((v) => { if (active) setVehicle(v); });
    return () => { active = false; };
  }, [booking?.vehicleId]);

  if (!booking) return null;
  if (!vehicle) {
    return (
      <SafeAreaView style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.gold} />
      </SafeAreaView>
    );
  }

  const actions = [
    { label: t('booking.instructions'), icon: 'reader-outline', screen: 'Instructions' },
    { label: t('booking.checkIn'), icon: 'camera-outline', screen: 'CheckIn' },
    { label: t('booking.inProgress'), icon: 'speedometer-outline', screen: 'ActiveRental' },
    { label: t('booking.checkOut'), icon: 'checkmark-done-outline', screen: 'CheckOut' },
    { label: t('booking.assistance'), icon: 'headset-outline', screen: 'Assistance' },
    { label: t('booking.invoice'), icon: 'document-text-outline', screen: 'Invoice' },
    { label: t('booking.review'), icon: 'star-outline', screen: 'Review' },
  ];
  if (contract) {
    actions.splice(1, 0, {
      label: 'Contrat', icon: 'document-lock-outline', screen: 'Contract',
      params: { contractId: contract.id },
      badge: contract.status !== 'completed',
    });
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>{t('booking.priceDetails')}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <View style={styles.card}>
          <Text style={styles.vehicleName}>{vehicle.make} {vehicle.model}</Text>
          <Text style={styles.dates}>{formatDateTime(booking.startsAt)} → {formatDateTime(booking.endsAt)}</Text>
          <Text style={styles.total}>{formatMoney(booking.totalMinor, booking.currency)}</Text>
          {booking.deliveryAddress && (
            <View style={styles.deliveryRow}>
              <Ionicons name="bicycle-outline" size={15} color={colors.gold} />
              <Text style={styles.deliveryText}>Livraison prévue à : {booking.deliveryAddress}</Text>
            </View>
          )}
        </View>
        <View style={styles.grid}>
          {actions.map((a) => (
            <Pressable key={a.label} style={styles.actionCard} onPress={() => navigation.navigate(a.screen, a.params || { bookingId: booking.id })}>
              {a.badge && <View style={styles.actionDot} />}
              <Ionicons name={a.icon} size={22} color={colors.gold} />
              <Text style={styles.actionLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>
        {booking.status !== 'completed' && booking.status !== 'cancelled' && (
          <PrimaryButton label={t('booking.cancel')} variant="outline" onPress={() => navigation.goBack()} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  card: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 16 },
  vehicleName: { ...typography.h2 },
  dates: { ...typography.caption, marginTop: 6 },
  total: { color: colors.gold, fontWeight: '800', fontSize: 18, marginTop: 8 },
  deliveryRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 10 },
  deliveryText: { ...typography.caption, color: colors.textSecondary, flexShrink: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: { width: '31%', aspectRatio: 1, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 8 },
  actionDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.red },
  actionLabel: { ...typography.caption, textAlign: 'center', color: colors.textSecondary },
});
