import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import { getVehicleById as getDemoVehicleById } from '../../data/vehicles';
import { formatMoney, computePriceBreakdown } from '../../utils/format';
import { computeOptionsBreakdown } from '../../data/bookingOptions';
import { CATEGORY_REQUIREMENTS } from '../../data/categoryRequirements';
import { KYC_DOCUMENTS } from '../../data/kycRequirements';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppState } from '../../context/AppStateContext';

const METHODS = [
  { id: 'card', icon: 'card-outline', label: 'Carte bancaire' },
  { id: 'wallet', icon: 'wallet-outline', label: 'Portefeuille CAR ONE PLUS' },
];

export default function PaymentScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { user, bookingDraft, setBookings, addLoyaltyPoints, documents, signature, createContract, signContract } = useAppState();
  const vehicle = bookingDraft?.vehicle || getDemoVehicleById(route.params.vehicleId);
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const days = bookingDraft?.days || 1;
  const { protectionMinor, deliveryMinor, optionsMinor } = computeOptionsBreakdown(bookingDraft?.options || [], days);
  const breakdown = computePriceBreakdown({
    dailyPriceMinor: vehicle.priceDayMinor,
    days,
    protectionMinor,
    optionsMinor,
    deliveryMinor,
  });

  const pay = () => {
    setLoading(true);
    // PSP non encore sélectionné (04_ARCHITECTURE_TECHNIQUE.md) — simulation locale du paiement.
    setTimeout(() => {
      const booking = {
        id: `b-${Date.now()}`, vehicleId: vehicle.id, status: 'confirmed',
        startsAt: new Date().toISOString(), endsAt: new Date(Date.now() + (bookingDraft?.days || 1) * 86400000).toISOString(),
        totalMinor: breakdown.total, currency: vehicle.currency,
        deliveryAddress: bookingDraft?.deliveryAddress || null,
      };
      setBookings((prev) => [booking, ...prev]);

      // Contrat de location généré automatiquement — le locataire doit signer
      // les deux parties avant que la location ne soit juridiquement valide
      // (voir ContractScreen.js). Documents requis : ceux du locataire (KYC)
      // + ceux exigés pour la catégorie du bien (category_requirements).
      const requiredRenterDocs = KYC_DOCUMENTS.individual;
      const requiredOwnerDocs = CATEGORY_REQUIREMENTS[vehicle.category]?.documents || [];
      const contractId = createContract({
        bookingId: booking.id,
        vehicleId: vehicle.id,
        category: vehicle.category,
        renterName: user.fullName,
        ownerName: vehicle.ownerName || 'CAR ONE PLUS',
        totalMinor: breakdown.total,
        currency: vehicle.currency,
        startsAt: booking.startsAt,
        endsAt: booking.endsAt,
        deliveryAddress: bookingDraft?.deliveryAddress || null,
        requiredRenterDocs,
        renterDocsSnapshot: requiredRenterDocs.map((key) => ({ key, present: Boolean(documents[key]) })),
        requiredOwnerDocs,
        status: 'pending_owner',
      });
      if (signature) signContract(contractId, 'renter');

      // Fidélité cross-catégorie : 1 point par euro dépensé, quelle que soit
      // la catégorie (vélo → jet privé) — voir LoyaltyScreen.js.
      addLoyaltyPoints(breakdown.total / 100);
      setLoading(false);
      navigation.replace('Confirmation', { bookingId: booking.id, pointsEarned: Math.round(breakdown.total / 100), contractId });
    }, 900);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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

        {bookingDraft?.deliveryAddress ? (
          <View style={styles.deliveryBox}>
            <Ionicons name="bicycle-outline" size={18} color={colors.gold} />
            <View style={{ flex: 1 }}>
              <Text style={styles.deliveryTitle}>{t('booking.delivery')} · {formatMoney(deliveryMinor, vehicle.currency)}</Text>
              <Text style={styles.deliveryAddress}>{bookingDraft.deliveryAddress}</Text>
            </View>
          </View>
        ) : null}

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
  deliveryBox: { flexDirection: 'row', gap: 10, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14, alignItems: 'flex-start' },
  deliveryTitle: { ...typography.body, fontWeight: '700' },
  deliveryAddress: { ...typography.caption, marginTop: 2 },
  sectionTitle: { ...typography.h3 },
  methodRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14 },
  methodRowActive: { borderColor: colors.gold },
  methodLabel: { ...typography.body, flex: 1 },
  depositNote: { flexDirection: 'row', gap: 8, marginTop: 8 },
  depositNoteText: { ...typography.caption, flex: 1, lineHeight: 17 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.cardBorder },
});
