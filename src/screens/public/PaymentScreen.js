import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import { getVehicleById } from '../../data/vehicles';
import { formatMoney, computePriceBreakdown } from '../../utils/format';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppState } from '../../context/AppStateContext';

const METHODS = [
  { id: 'card', icon: 'card-outline', label: 'Carte bancaire' },
  { id: 'wallet', icon: 'wallet-outline', label: 'Portefeuille CAR ONE PLUS' },
];

export default function PaymentScreen({ navigation, route }) {
  const { t } = useTranslation();
  const vehicle = getVehicleById(route.params.vehicleId);
  const { bookingDraft, setBookings } = useAppState();
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const breakdown = computePriceBreakdown({
    dailyPriceMinor: vehicle.priceDayMinor,
    days: bookingDraft?.days || 1,
    protectionMinor: bookingDraft?.protection ? 1500 * (bookingDraft?.days || 1) : 0,
    optionsMinor: ((bookingDraft?.options?.length || 0) - (bookingDraft?.protection ? 1 : 0)) * 800 * (bookingDraft?.days || 1),
  });

  const pay = () => {
    setLoading(true);
    // PSP non encore sélectionné (04_ARCHITECTURE_TECHNIQUE.md) — simulation locale du paiement.
    setTimeout(() => {
      const booking = {
        id: `b-${Date.now()}`, vehicleId: vehicle.id, status: 'confirmed',
        startsAt: new Date().toISOString(), endsAt: new Date(Date.now() + (bookingDraft?.days || 1) * 86400000).toISOString(),
        totalMinor: breakdown.total, currency: vehicle.currency,
      };
      setBookings((prev) => [booking, ...prev]);
      setLoading(false);
      navigation.replace('Confirmation', { bookingId: booking.id });
    }, 900);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>{t('booking.payment')}</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>{t('booking.total')}</Text>
          <Text style={styles.totalValue}>{formatMoney(breakdown.total, vehicle.currency)}</Text>
        </View>
        <Text style={styles.sectionTitle}>Méthode de paiement</Text>
        {METHODS.map((m) => (
          <Pressable key={m.id} style={[styles.methodRow, method === m.id && styles.methodRowActive]} onPress={() => setMethod(m.id)}>
            <Ionicons name={m.icon} size={20} color={colors.gold} />
            <Text style={styles.methodLabel}>{m.label}</Text>
            <Ionicons name={method === m.id ? 'radio-button-on' : 'radio-button-off'} size={20} color={method === m.id ? colors.gold : colors.textMuted} />
          </Pressable>
        ))}
        <View style={styles.depositNote}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.depositNoteText}>Une préautorisation du dépôt de garantie est réalisée à la confirmation puis libérée automatiquement en l'absence de dossier ouvert.</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <PrimaryButton label={t('booking.confirm')} onPress={pay} loading={loading} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  content: { padding: 20, gap: 14 },
  totalCard: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 18, alignItems: 'center', gap: 4, marginBottom: 8 },
  totalLabel: { ...typography.caption },
  totalValue: { color: colors.gold, fontWeight: '800', fontSize: 26 },
  sectionTitle: { ...typography.h3 },
  methodRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14 },
  methodRowActive: { borderColor: colors.gold },
  methodLabel: { ...typography.body, flex: 1 },
  depositNote: { flexDirection: 'row', gap: 8, marginTop: 8 },
  depositNoteText: { ...typography.caption, flex: 1, lineHeight: 17 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.cardBorder },
});
