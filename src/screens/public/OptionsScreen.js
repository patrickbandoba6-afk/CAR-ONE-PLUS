import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import { formatMoney } from '../../utils/format';
import { BOOKING_OPTIONS } from '../../data/bookingOptions';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppState } from '../../context/AppStateContext';

export default function OptionsScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { bookingDraft, setBookingDraft } = useAppState();
  const [selected, setSelected] = useState(bookingDraft?.options || []);
  const [deliveryAddress, setDeliveryAddress] = useState(bookingDraft?.deliveryAddress || '');

  const toggle = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const deliverySelected = selected.includes('delivery');
  const canProceed = !deliverySelected || deliveryAddress.trim().length > 0;

  const proceed = () => {
    setBookingDraft((prev) => ({
      ...prev,
      options: selected,
      protection: selected.includes('protection'),
      deliveryAddress: deliverySelected ? deliveryAddress.trim() : null,
    }));
    navigation.navigate('Payment', { vehicleId: route.params.vehicleId });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>{t('booking.options')}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
        {BOOKING_OPTIONS.map((opt) => {
          const active = selected.includes(opt.id);
          return (
            <View key={opt.id}>
              <Pressable style={[styles.card, active && styles.cardActive]} onPress={() => toggle(opt.id)}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{opt.label}</Text>
                  <Text style={styles.cardDesc}>{opt.desc}</Text>
                  <Text style={styles.cardPrice}>+ {formatMoney(opt.priceMinor, 'EUR')}{opt.unit === 'day' ? '/jour' : ' (forfait unique)'}</Text>
                </View>
                <Ionicons name={active ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={active ? colors.gold : colors.textMuted} />
              </Pressable>
              {opt.requiresAddress && active && (
                <View style={styles.addressBox}>
                  <Text style={styles.addressLabel}>Adresse de livraison</Text>
                  <TextInput
                    style={styles.addressInput}
                    placeholder="Numéro, rue, ville..."
                    placeholderTextColor={colors.textMuted}
                    value={deliveryAddress}
                    onChangeText={setDeliveryAddress}
                    multiline
                  />
                  {!deliveryAddress.trim() && <Text style={styles.addressWarning}>Renseignez l'adresse pour que le propriétaire puisse vous livrer.</Text>}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton label={t('common.next')} onPress={proceed} disabled={!canProceed} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 16 },
  cardActive: { borderColor: colors.gold },
  cardTitle: { ...typography.h3, fontSize: 15 },
  cardDesc: { ...typography.caption, marginTop: 2 },
  cardPrice: { color: colors.gold, fontWeight: '700', fontSize: 13, marginTop: 6 },
  addressBox: { backgroundColor: colors.bgElevated, borderRadius: radii.md, padding: 14, marginTop: 8, gap: 8 },
  addressLabel: { ...typography.caption, fontWeight: '700', color: colors.textSecondary },
  addressInput: { backgroundColor: colors.card, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.cardBorder, paddingHorizontal: 14, paddingVertical: 10, minHeight: 44, color: colors.white },
  addressWarning: { ...typography.caption, color: colors.amber },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.cardBorder },
});
