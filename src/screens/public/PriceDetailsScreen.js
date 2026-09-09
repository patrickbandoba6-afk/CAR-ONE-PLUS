import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import { getVehicleById } from '../../data/vehicles';
import { formatMoney, computePriceBreakdown } from '../../utils/format';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppState } from '../../context/AppStateContext';

export default function PriceDetailsScreen({ navigation, route }) {
  const { t } = useTranslation();
  const vehicle = getVehicleById(route.params.vehicleId);
  const { bookingDraft, setBookingDraft } = useAppState();
  const [days, setDays] = useState(bookingDraft?.days || 3);

  const breakdown = useMemo(() => computePriceBreakdown({
    dailyPriceMinor: vehicle.priceDayMinor, days,
    protectionMinor: bookingDraft?.protection ? 1500 * days : 0,
  }), [vehicle, days, bookingDraft]);

  const proceed = () => {
    setBookingDraft((prev) => ({ ...prev, days }));
    navigation.navigate('Options', { vehicleId: vehicle.id });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>{t('booking.priceDetails')}</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
        <View style={styles.daysRow}>
          <Text style={styles.daysLabel}>Durée de location</Text>
          <View style={styles.stepper}>
            <Pressable style={styles.stepperBtn} onPress={() => setDays(Math.max(1, days - 1))}><Ionicons name="remove" size={18} color={colors.white} /></Pressable>
            <Text style={styles.stepperValue}>{days} {t('vehicle.days')}</Text>
            <Pressable style={styles.stepperBtn} onPress={() => setDays(days + 1)}><Ionicons name="add" size={18} color={colors.white} /></Pressable>
          </View>
        </View>

        <View style={styles.breakdown}>
          <Row label={`${t('booking.rental')} (${days} × ${formatMoney(vehicle.priceDayMinor, vehicle.currency)})`} value={formatMoney(breakdown.rental, vehicle.currency)} />
          {breakdown.protectionMinor > 0 && <Row label={t('booking.protectionFee')} value={formatMoney(breakdown.protectionMinor, vehicle.currency)} />}
          <View style={styles.divider} />
          <Row label={t('booking.total')} value={formatMoney(breakdown.total, vehicle.currency)} bold />
        </View>
        <Text style={styles.note}>Commission plateforme (5%) prélevée sur le versement propriétaire — jamais ajoutée à votre prix.</Text>
      </View>
      <View style={styles.footer}>
        <PrimaryButton label={t('common.next')} onPress={proceed} />
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value, bold }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, bold && styles.rowLabelBold]}>{label}</Text>
      <Text style={[styles.rowValue, bold && styles.rowValueBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  content: { padding: 20, gap: 20 },
  daysRow: { gap: 10 },
  daysLabel: { ...typography.h3 },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 8 },
  stepperBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' },
  stepperValue: { ...typography.body, fontWeight: '700' },
  breakdown: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 16, gap: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowLabel: { ...typography.bodyMuted, flexShrink: 1 },
  rowLabelBold: { color: colors.white, fontWeight: '700' },
  rowValue: { ...typography.body },
  rowValueBold: { color: colors.gold, fontWeight: '800', fontSize: 17 },
  divider: { height: 1, backgroundColor: colors.cardBorder, marginVertical: 2 },
  note: { ...typography.caption, lineHeight: 17 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.cardBorder },
});
