import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii, shadow } from '../../theme/colors';
import { DEMO_VEHICLES } from '../../data/vehicles';
import { formatMoney } from '../../utils/format';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppState } from '../../context/AppStateContext';

export default function OwnerDashboardScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { user } = useAppState();
  const myVehicles = DEMO_VEHICLES.filter((v) => v.ownerKind !== 'platform_fleet').slice(0, 3);

  const actions = [
    { label: t('owner.myVehicles'), icon: 'car-sport-outline', screen: 'MyVehicles' },
    { label: t('owner.bookings'), icon: 'calendar-outline', screen: 'OwnerBookings' },
    { label: t('owner.calendar'), icon: 'today-outline', screen: 'Calendar' },
    { label: t('owner.earnings'), icon: 'trending-up-outline', screen: 'Earnings' },
    { label: t('owner.maintenance'), icon: 'construct-outline', screen: 'Maintenance' },
    { label: t('owner.claims'), icon: 'shield-outline', screen: 'Claims' },
    { label: t('owner.stats'), icon: 'stats-chart-outline', screen: 'Stats' },
    { label: t('owner.documents'), icon: 'folder-outline', screen: 'Documents' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <View>
          <Text style={styles.greeting}>{t('owner.dashboard')}</Text>
          <Text style={styles.sub}>Bienvenue {user.fullName?.split(' ')[0] || ''}</Text>
        </View>

        {route.params?.justPublished && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={20} color={colors.green} />
            <Text style={styles.successText}>Votre annonce a été envoyée pour modération.</Text>
          </View>
        )}

        <View style={styles.statsRow}>
          <StatCard label="Revenus (30j)" value={formatMoney(184000, 'EUR')} icon="cash-outline" />
          <StatCard label="Réservations" value="12" icon="calendar-outline" />
        </View>

        <PrimaryButton label={t('owner.addVehicle')} onPress={() => navigation.navigate('AddVehicle')} />

        <View style={styles.grid}>
          {actions.map((a) => (
            <Pressable key={a.label} style={[styles.actionCard, shadow]} onPress={() => navigation.navigate(a.screen)}>
              <Ionicons name={a.icon} size={22} color={colors.gold} />
              <Text style={styles.actionLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        <View>
          <Text style={styles.sectionTitle}>{t('owner.myVehicles')}</Text>
          {myVehicles.map((v) => (
            <Pressable key={v.id} style={styles.vehicleRow} onPress={() => navigation.navigate('MyVehicles')}>
              <View style={styles.vehiclePhoto}><Ionicons name="car-sport" size={20} color={colors.textMuted} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.vehicleName}>{v.make} {v.model}</Text>
                <Text style={styles.vehicleMeta}>{formatMoney(v.priceDayMinor, v.currency)}/jour · Publiée</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
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
  greeting: { ...typography.h1, fontSize: 24 },
  sub: { ...typography.bodyMuted, marginTop: 2 },
  successBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.bgElevated, borderRadius: radii.md, padding: 14 },
  successText: { ...typography.body, flex: 1 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 16, gap: 6 },
  statValue: { ...typography.h2, fontSize: 20 },
  statLabel: { ...typography.caption },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: { width: '31%', aspectRatio: 1, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 6 },
  actionLabel: { ...typography.caption, textAlign: 'center', color: colors.textSecondary },
  sectionTitle: { ...typography.h3, marginBottom: 10 },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 12, marginBottom: 10 },
  vehiclePhoto: { width: 44, height: 44, borderRadius: radii.sm, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' },
  vehicleName: { ...typography.body, fontWeight: '700' },
  vehicleMeta: { ...typography.caption, marginTop: 2 },
});
