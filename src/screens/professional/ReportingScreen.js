import React, { useMemo } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii } from '../../theme/colors';
import { CATEGORY_LABELS } from '../../data/categories';
import { useAppState } from '../../context/AppStateContext';

export default function ReportingScreen({ navigation }) {
  const { myListings, bookingRequests, bookings } = useAppState();
  const listings = myListings.filter((l) => l.ownerKind === 'professional');

  const byCategory = useMemo(() => listings.reduce((acc, l) => {
    acc[l.category] = (acc[l.category] || 0) + 1;
    return acc;
  }, {}), [listings]);
  const maxCategory = Math.max(1, ...Object.values(byCategory));

  const total = bookingRequests.length;
  const accepted = bookingRequests.filter((r) => r.status === 'accepted').length;
  const declined = bookingRequests.filter((r) => r.status === 'declined').length;
  const pending = bookingRequests.filter((r) => r.status === 'pending').length;
  const acceptanceRate = total ? Math.round((accepted / total) * 100) : 0;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>Reporting</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 18 }}>
        <View style={styles.statsRow}>
          <StatCard label="Biens en flotte" value={String(listings.length)} icon="car-sport-outline" />
          <StatCard label="Réservations confirmées" value={String(bookings.length)} icon="calendar-outline" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Taux d'acceptation des demandes</Text>
          <Text style={styles.rate}>{acceptanceRate}%</Text>
          <View style={styles.legendRow}>
            <Legend color={colors.green} label={`${accepted} acceptées`} />
            <Legend color={colors.textMuted} label={`${declined} refusées`} />
            <Legend color={colors.amber} label={`${pending} en attente`} />
          </View>
        </View>

        {Object.keys(byCategory).length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Répartition de la flotte</Text>
            <View style={{ gap: 10 }}>
              {Object.entries(byCategory).map(([cat, count]) => (
                <View key={cat}>
                  <View style={styles.barRow}>
                    <Text style={styles.barLabel}>{CATEGORY_LABELS[cat] || cat}</Text>
                    <Text style={styles.barValue}>{count}</Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${(count / maxCategory) * 100}%` }]} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {listings.length === 0 && (
          <Text style={styles.empty}>Ajoutez des biens dans « Ma flotte » pour voir vos statistiques évoluer.</Text>
        )}
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

function Legend({ color, label }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      <Text style={styles.legendText}>{label}</Text>
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
  card: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 16, gap: 8 },
  cardTitle: { ...typography.h3, fontSize: 14 },
  rate: { color: colors.gold, fontWeight: '800', fontSize: 28 },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 4 },
  legendText: { ...typography.caption },
  sectionTitle: { ...typography.h3, fontSize: 14, marginBottom: 10 },
  barRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  barLabel: { ...typography.caption, color: colors.textSecondary },
  barValue: { ...typography.caption, fontWeight: '700' },
  barTrack: { height: 6, borderRadius: 3, backgroundColor: colors.bgElevated, overflow: 'hidden' },
  barFill: { height: 6, backgroundColor: colors.gold },
  empty: { ...typography.bodyMuted, textAlign: 'center', marginTop: 10, lineHeight: 19 },
});
