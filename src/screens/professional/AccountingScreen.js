import React, { useMemo } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii } from '../../theme/colors';
import { DEMO_VEHICLES } from '../../data/vehicles';
import { CATEGORY_LABELS } from '../../data/categories';
import { useAppState } from '../../context/AppStateContext';
import { formatMoney, formatDate } from '../../utils/format';

const COMMISSION_RATE = 0.05;

export default function AccountingScreen({ navigation }) {
  const { bookings, myListings } = useAppState();

  const listingsById = useMemo(() => Object.fromEntries([
    ...DEMO_VEHICLES.filter((v) => v.ownerKind !== 'platform_fleet'),
    ...myListings,
  ].map((l) => [l.id, l])), [myListings]);

  const rows = bookings.map((b) => {
    const vehicle = listingsById[b.vehicleId];
    const commissionMinor = Math.round(b.totalMinor * COMMISSION_RATE);
    return { ...b, vehicle, commissionMinor, netMinor: b.totalMinor - commissionMinor };
  }).filter((r) => r.vehicle);

  const grossMinor = rows.reduce((s, r) => s + r.totalMinor, 0);
  const commissionMinor = rows.reduce((s, r) => s + r.commissionMinor, 0);
  const netMinor = grossMinor - commissionMinor;
  const currency = rows[0]?.currency || 'EUR';

  const byCategory = rows.reduce((acc, r) => {
    const cat = r.vehicle.category;
    acc[cat] = (acc[cat] || 0) + r.totalMinor;
    return acc;
  }, {});
  const maxCategoryMinor = Math.max(1, ...Object.values(byCategory));

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>Comptabilité</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 18 }}>
        <View style={styles.statsRow}>
          <StatCard label="Revenus bruts" value={formatMoney(grossMinor, currency)} icon="cash-outline" />
          <StatCard label="Commission (5%)" value={formatMoney(commissionMinor, currency)} icon="business-outline" />
        </View>
        <View style={styles.netCard}>
          <Text style={styles.netLabel}>Reversé (net)</Text>
          <Text style={styles.netValue}>{formatMoney(netMinor, currency)}</Text>
        </View>

        {Object.keys(byCategory).length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Revenus par catégorie</Text>
            <View style={{ gap: 10 }}>
              {Object.entries(byCategory).map(([cat, minor]) => (
                <View key={cat}>
                  <View style={styles.barRow}>
                    <Text style={styles.barLabel}>{CATEGORY_LABELS[cat] || cat}</Text>
                    <Text style={styles.barValue}>{formatMoney(minor, currency)}</Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${(minor / maxCategoryMinor) * 100}%` }]} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View>
          <Text style={styles.sectionTitle}>Transactions</Text>
          {rows.length === 0 ? (
            <Text style={styles.empty}>Aucune transaction pour l'instant.</Text>
          ) : rows.map((r) => (
            <View key={r.id} style={styles.txRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.txVehicle}>{r.vehicle.make} {r.vehicle.model}</Text>
                <Text style={styles.txDate}>{formatDate(r.startsAt)}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.txGross}>{formatMoney(r.totalMinor, r.currency)}</Text>
                <Text style={styles.txNet}>net {formatMoney(r.netMinor, r.currency)}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={20} color={colors.gold} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 16, gap: 6 },
  statValue: { ...typography.h2, fontSize: 19 },
  statLabel: { ...typography.caption },
  netCard: { backgroundColor: colors.bgElevated, borderRadius: radii.md, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  netLabel: { ...typography.body, fontWeight: '700' },
  netValue: { color: colors.gold, fontWeight: '800', fontSize: 20 },
  sectionTitle: { ...typography.h3, fontSize: 14, marginBottom: 10 },
  barRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  barLabel: { ...typography.caption, color: colors.textSecondary },
  barValue: { ...typography.caption, fontWeight: '700' },
  barTrack: { height: 6, borderRadius: 3, backgroundColor: colors.card, overflow: 'hidden' },
  barFill: { height: 6, backgroundColor: colors.gold },
  empty: { ...typography.bodyMuted },
  txRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14, marginBottom: 8 },
  txVehicle: { ...typography.body, fontWeight: '700' },
  txDate: { ...typography.caption, marginTop: 2 },
  txGross: { ...typography.body, fontWeight: '700' },
  txNet: { ...typography.caption, color: colors.green, marginTop: 2 },
});
