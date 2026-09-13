import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii } from '../../theme/colors';
import { useAppState } from '../../context/AppStateContext';

// Programme de fidélité cross-catégorie — un seul compte de points valable du
// vélo au jet privé, ce qu'aucun concurrent mono-catégorie (Turo, Getaround...)
// ne peut proposer. 1 point = 1 € dépensé, toutes catégories confondues
// (voir PaymentScreen.js — addLoyaltyPoints).
const TIERS = [
  { key: 'decouverte', label: 'Découverte', min: 0, perk: 'Accès à toutes les catégories' },
  { key: 'argent', label: 'Argent', min: 500, perk: '-5% sur les frais de service' },
  { key: 'or', label: 'Or', min: 1500, perk: 'Réservation prioritaire + -10% sur les frais de service' },
  { key: 'platine', label: 'Platine', min: 5000, perk: 'Surclassement catégorie selon disponibilité + -15%' },
];

function currentTier(points) {
  return [...TIERS].reverse().find((t) => points >= t.min) || TIERS[0];
}
function nextTier(points) {
  return TIERS.find((t) => t.min > points) || null;
}

export default function LoyaltyScreen({ navigation }) {
  const { loyaltyPoints } = useAppState();
  const tier = currentTier(loyaltyPoints);
  const next = nextTier(loyaltyPoints);
  const progress = next ? Math.min(1, (loyaltyPoints - tier.min) / (next.min - tier.min)) : 1;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>Fidélité</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 18 }}>
        <View style={styles.balanceCard}>
          <Ionicons name="trophy" size={30} color={colors.gold} />
          <Text style={styles.balanceValue}>{loyaltyPoints} pts</Text>
          <Text style={styles.balanceLabel}>Niveau {tier.label}</Text>
          {next ? (
            <>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              </View>
              <Text style={styles.progressHint}>{next.min - loyaltyPoints} pts avant le niveau {next.label}</Text>
            </>
          ) : (
            <Text style={styles.progressHint}>Niveau maximum atteint</Text>
          )}
        </View>

        <View style={styles.noticeBox}>
          <Ionicons name="infinite-outline" size={18} color={colors.gold} />
          <Text style={styles.noticeText}>Un seul compte de points, valable sur les 17 catégories du catalogue — d'un vélo en ville à un jet privé, vos points ne sont jamais limités à un type de véhicule.</Text>
        </View>

        <Text style={styles.sectionTitle}>Niveaux</Text>
        {TIERS.map((t) => (
          <View key={t.key} style={[styles.tierRow, t.key === tier.key && styles.tierRowActive]}>
            <Ionicons name={t.key === tier.key ? 'star' : 'star-outline'} size={18} color={t.key === tier.key ? colors.gold : colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={styles.tierLabel}>{t.label} <Text style={styles.tierMin}>· {t.min}+ pts</Text></Text>
              <Text style={styles.tierPerk}>{t.perk}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  balanceCard: { backgroundColor: colors.card, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.cardBorder, padding: 22, alignItems: 'center', gap: 6 },
  balanceValue: { color: colors.white, fontWeight: '800', fontSize: 28, marginTop: 4 },
  balanceLabel: { ...typography.caption, color: colors.gold, fontWeight: '700' },
  progressTrack: { width: '100%', height: 5, backgroundColor: colors.bgElevated, borderRadius: 3, marginTop: 12 },
  progressFill: { height: 5, backgroundColor: colors.gold, borderRadius: 3 },
  progressHint: { ...typography.caption, marginTop: 6 },
  noticeBox: { flexDirection: 'row', gap: 10, backgroundColor: colors.bgElevated, borderRadius: radii.md, padding: 14, alignItems: 'flex-start' },
  noticeText: { ...typography.caption, flex: 1, lineHeight: 18 },
  sectionTitle: { ...typography.h3, fontSize: 14 },
  tierRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14 },
  tierRowActive: { borderColor: colors.gold },
  tierLabel: { ...typography.body, fontWeight: '700' },
  tierMin: { ...typography.caption, fontWeight: '400' },
  tierPerk: { ...typography.caption, marginTop: 2 },
});
