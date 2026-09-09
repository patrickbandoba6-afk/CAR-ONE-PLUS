import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import { getVehicleById } from '../../data/vehicles';
import { formatMoney, formatDateTime } from '../../utils/format';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppState } from '../../context/AppStateContext';

export default function BookingDetailScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { bookings } = useAppState();
  const booking = bookings.find((b) => b.id === route.params.bookingId);
  const vehicle = booking ? getVehicleById(booking.vehicleId) : null;
  if (!booking || !vehicle) return null;

  const actions = [
    { label: t('booking.instructions'), icon: 'reader-outline', screen: 'Instructions' },
    { label: t('booking.checkIn'), icon: 'camera-outline', screen: 'CheckIn' },
    { label: t('booking.inProgress'), icon: 'speedometer-outline', screen: 'ActiveRental' },
    { label: t('booking.checkOut'), icon: 'checkmark-done-outline', screen: 'CheckOut' },
    { label: t('booking.assistance'), icon: 'headset-outline', screen: 'Assistance' },
    { label: t('booking.invoice'), icon: 'document-text-outline', screen: 'Invoice' },
    { label: t('booking.review'), icon: 'star-outline', screen: 'Review' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
        </View>
        <View style={styles.grid}>
          {actions.map((a) => (
            <Pressable key={a.label} style={styles.actionCard} onPress={() => navigation.navigate(a.screen, { bookingId: booking.id })}>
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: { width: '31%', aspectRatio: 1, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 8 },
  actionLabel: { ...typography.caption, textAlign: 'center', color: colors.textSecondary },
});
