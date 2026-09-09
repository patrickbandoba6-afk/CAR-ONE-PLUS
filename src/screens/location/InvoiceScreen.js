import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii } from '../../theme/colors';
import { getVehicleById } from '../../data/vehicles';
import { formatMoney, computePriceBreakdown } from '../../utils/format';
import { useAppState } from '../../context/AppStateContext';
import PrimaryButton from '../../components/PrimaryButton';

export default function InvoiceScreen({ navigation, route }) {
  const { bookings } = useAppState();
  const booking = bookings.find((b) => b.id === route.params?.bookingId) || bookings[0];
  const vehicle = booking ? getVehicleById(booking.vehicleId) : null;
  if (!booking || !vehicle) return null;
  const breakdown = computePriceBreakdown({ dailyPriceMinor: vehicle.priceDayMinor, days: 3 });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>Facture</Text>
        <Ionicons name="share-outline" size={20} color={colors.gold} />
      </View>
      <View style={{ padding: 20 }}>
        <View style={styles.card}>
          <Text style={styles.vehicleName}>{vehicle.make} {vehicle.model}</Text>
          <Text style={styles.ref}>Réservation #{booking.id.slice(-6).toUpperCase()}</Text>
          <View style={styles.divider} />
          <Row label="Location" value={formatMoney(breakdown.rental, vehicle.currency)} />
          <Row label="Frais de service" value={formatMoney(breakdown.protectionMinor, vehicle.currency)} />
          <View style={styles.divider} />
          <Row label="Total payé" value={formatMoney(booking.totalMinor, booking.currency)} bold />
        </View>
        <PrimaryButton label="Télécharger le PDF" variant="outline" onPress={() => {}} style={{ marginTop: 20 }} />
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value, bold }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, bold && { color: colors.white, fontWeight: '700' }]}>{label}</Text>
      <Text style={[styles.rowValue, bold && { color: colors.gold, fontWeight: '800' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  card: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 18 },
  vehicleName: { ...typography.h2 },
  ref: { ...typography.caption, marginTop: 4 },
  divider: { height: 1, backgroundColor: colors.cardBorder, marginVertical: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  rowLabel: { ...typography.bodyMuted },
  rowValue: { ...typography.body },
});
