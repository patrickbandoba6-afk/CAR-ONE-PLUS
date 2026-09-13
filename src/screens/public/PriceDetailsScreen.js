import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import { getVehicleById as getDemoVehicleById } from '../../data/vehicles';
import { formatMoney, computePriceBreakdown } from '../../utils/format';
import { estimateTripCo2Kg } from '../../data/co2';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppState } from '../../context/AppStateContext';

const PRICE_LOCK_MS = 15 * 60 * 1000;

export default function PriceDetailsScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { bookingDraft, setBookingDraft } = useAppState();
  const vehicle = bookingDraft?.vehicle || getDemoVehicleById(route.params.vehicleId);
  const [days, setDays] = useState(bookingDraft?.days || 3);
  const [now, setNow] = useState(Date.now());

  // Prix bloqué ~15 min dès l'arrivée sur cet écran, même si la demande varie
  // entre-temps côté annonce — aucun moteur de repricing n'est encore branché
  // (voir 04_ARCHITECTURE_TECHNIQUE.md), donc le prix ne bouge de toute façon
  // pas en démo, mais le badge reflète l'engagement pris.
  useEffect(() => {
    const expiresAt = bookingDraft?.priceLockExpiresAt ? new Date(bookingDraft.priceLockExpiresAt).getTime() : 0;
    if (expiresAt < Date.now()) {
      setBookingDraft((prev) => ({ ...prev, priceLockExpiresAt: new Date(Date.now() + PRICE_LOCK_MS).toISOString() }));
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const lockRemainingMs = bookingDraft?.priceLockExpiresAt ? new Date(bookingDraft.priceLockExpiresAt).getTime() - now : 0;
  const lockActive = lockRemainingMs > 0;
  const lockMinutes = Math.max(0, Math.floor(lockRemainingMs / 60000));
  const lockSeconds = Math.max(0, Math.floor((lockRemainingMs % 60000) / 1000));

  const breakdown = useMemo(() => computePriceBreakdown({
    dailyPriceMinor: vehicle.priceDayMinor, days,
    protectionMinor: bookingDraft?.protection ? 1500 * days : 0,
  }), [vehicle, days, bookingDraft]);

  const co2Kg = vehicle.includedKmPerDay != null ? estimateTripCo2Kg(vehicle.category, vehicle.includedKmPerDay * days) : null;

  const proceed = () => {
    setBookingDraft((prev) => ({ ...prev, days }));
    navigation.navigate('Options', { vehicleId: vehicle.id });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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

        {lockActive ? (
          <View style={styles.lockBadge}>
            <Ionicons name="lock-closed" size={14} color={colors.gold} />
            <Text style={styles.lockText}>Prix bloqué encore {lockMinutes}:{String(lockSeconds).padStart(2, '0')}</Text>
          </View>
        ) : (
          <View style={[styles.lockBadge, styles.lockBadgeExpired]}>
            <Ionicons name="time-outline" size={14} color={colors.textMuted} />
            <Text style={styles.lockTextExpired}>Prix non garanti au-delà de 15 min</Text>
          </View>
        )}

        <View style={styles.breakdown}>
          <Row label={`${t('booking.rental')} (${days} × ${formatMoney(vehicle.priceDayMinor, vehicle.currency)})`} value={formatMoney(breakdown.rental, vehicle.currency)} />
          {breakdown.protectionMinor > 0 && <Row label={t('booking.protectionFee')} value={formatMoney(breakdown.protectionMinor, vehicle.currency)} />}
          <View style={styles.divider} />
          <Row label={t('booking.total')} value={formatMoney(breakdown.total, vehicle.currency)} bold />
        </View>

        {co2Kg != null && (
          <View style={styles.kmRow}>
            <Ionicons name="leaf-outline" size={16} color={colors.green} />
            <Text style={styles.kmText}>≈ {co2Kg} kg CO2e estimé pour ce trajet</Text>
          </View>
        )}

        {vehicle.includedKmPerDay != null && (
          <View style={styles.kmRow}>
            <Ionicons name="speedometer-outline" size={16} color={colors.gold} />
            <Text style={styles.kmText}>
              {vehicle.includedKmPerDay * days} km inclus pour {days} {days > 1 ? 'jours' : 'jour'}
              {vehicle.extraKmPriceMinor != null ? ` · ${formatMoney(vehicle.extraKmPriceMinor, vehicle.currency)}/km au-delà` : ''}
            </Text>
          </View>
        )}

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
  lockBadge: { flexDirection: 'row', alignItems: 'center', gap: 7, alignSelf: 'flex-start', backgroundColor: colors.card, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.gold, paddingHorizontal: 12, paddingVertical: 6 },
  lockBadgeExpired: { borderColor: colors.cardBorder },
  lockText: { ...typography.caption, color: colors.gold, fontWeight: '700' },
  lockTextExpired: { ...typography.caption },
  breakdown: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 16, gap: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowLabel: { ...typography.bodyMuted, flexShrink: 1 },
  rowLabelBold: { color: colors.white, fontWeight: '700' },
  rowValue: { ...typography.body },
  rowValueBold: { color: colors.gold, fontWeight: '800', fontSize: 17 },
  divider: { height: 1, backgroundColor: colors.cardBorder, marginVertical: 2 },
  kmRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  kmText: { ...typography.caption, color: colors.textSecondary, flexShrink: 1 },
  note: { ...typography.caption, lineHeight: 17 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.cardBorder },
});
