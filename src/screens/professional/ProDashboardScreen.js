import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii, shadow } from '../../theme/colors';
import { useAppState } from '../../context/AppStateContext';

// Point d'entrée de l'espace professionnel — structure volontairement
// différente du dashboard particulier/propriétaire (OwnerDashboardScreen) :
// identité d'entreprise en tête plutôt que profil personnel, pas de bascule
// renter/owner (voir SideMenu.js). Les sections profondes (flotte,
// facturation, reporting...) restent des écrans "à venir" (Phase 3 —
// 09_ROADMAP.md) tant qu'elles ne sont pas construites.
const ACTIONS = [
  { label: 'Ma flotte', icon: 'car-sport-outline', screen: 'Fleet' },
  { label: 'Réservations', icon: 'calendar-outline', screen: 'ProBookings' },
  { label: 'Collaborateurs', icon: 'people-outline', screen: 'Collaborators' },
  { label: 'Comptabilité', icon: 'calculator-outline', screen: 'Accounting' },
  { label: 'Contrats', icon: 'document-text-outline', screen: 'Contracts' },
  { label: 'Reporting', icon: 'bar-chart-outline', screen: 'Reporting' },
];

export default function ProDashboardScreen({ navigation }) {
  const { user } = useAppState();
  const company = user.company || {};

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <View style={styles.companyCard}>
          <View style={styles.companyIcon}><Ionicons name="business" size={26} color={colors.gold} /></View>
          <View style={{ flex: 1 }}>
            <View style={styles.nameRow}>
              <Text style={styles.companyName} numberOfLines={1}>{company.name || 'Mon entreprise'}</Text>
              <View style={styles.proTag}><Text style={styles.proTagText}>PRO</Text></View>
            </View>
            <Text style={styles.companyMeta}>
              {company.registrationNumber ? `SIRET ${company.registrationNumber}` : 'SIRET non renseigné'}
              {company.verified ? ' · Vérifié' : ' · En attente de vérification'}
            </Text>
          </View>
        </View>

        {!company.verified && (
          <Pressable style={styles.noticeBox} onPress={() => navigation.navigate('IdentityVerification')}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.amber} />
            <Text style={styles.noticeText}>Complétez la vérification de votre entreprise (Kbis, représentant légal) pour publier des véhicules.</Text>
          </Pressable>
        )}

        <View style={styles.statsRow}>
          <StatCard label="Véhicules actifs" value="0" icon="car-sport-outline" />
          <StatCard label="Réservations (30j)" value="0" icon="calendar-outline" />
        </View>

        <View style={styles.grid}>
          {ACTIONS.map((a) => (
            <Pressable key={a.screen} style={[styles.actionCard, shadow]} onPress={() => navigation.navigate(a.screen)}>
              <Ionicons name={a.icon} size={22} color={colors.gold} />
              <Text style={styles.actionLabel}>{a.label}</Text>
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
  companyCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.card, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.cardBorder, padding: 16 },
  companyIcon: { width: 52, height: 52, borderRadius: radii.md, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  companyName: { ...typography.h2, fontSize: 18, flexShrink: 1 },
  proTag: { backgroundColor: colors.gold, borderRadius: radii.sm, paddingHorizontal: 7, paddingVertical: 2 },
  proTagText: { color: colors.bg, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  companyMeta: { ...typography.caption, marginTop: 3 },
  noticeBox: { flexDirection: 'row', gap: 10, backgroundColor: colors.bgElevated, borderRadius: radii.md, padding: 14, alignItems: 'flex-start' },
  noticeText: { ...typography.caption, flex: 1, lineHeight: 18 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 16, gap: 6 },
  statValue: { ...typography.h2, fontSize: 20 },
  statLabel: { ...typography.caption },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: { width: '31%', aspectRatio: 1, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 6 },
  actionLabel: { ...typography.caption, textAlign: 'center', color: colors.textSecondary },
});
