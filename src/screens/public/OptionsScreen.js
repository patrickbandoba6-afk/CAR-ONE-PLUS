import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import { formatMoney } from '../../utils/format';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppState } from '../../context/AppStateContext';

const OPTIONS = [
  { id: 'protection', label: 'Protection renforcée', desc: 'Réduit votre franchise en cas de dommage', priceMinor: 1500 },
  { id: 'extra_driver', label: 'Conducteur additionnel', desc: 'Ajoutez un conducteur vérifié', priceMinor: 800 },
  { id: 'child_seat', label: 'Siège bébé', desc: 'Fourni par le loueur', priceMinor: 500 },
  { id: 'delivery', label: 'Livraison à l\'adresse', desc: 'Le véhicule vous est livré', priceMinor: 2000 },
];

export default function OptionsScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { bookingDraft, setBookingDraft } = useAppState();
  const [selected, setSelected] = useState(bookingDraft?.options || []);

  const toggle = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const proceed = () => {
    setBookingDraft((prev) => ({ ...prev, options: selected, protection: selected.includes('protection') }));
    navigation.navigate('Payment', { vehicleId: route.params.vehicleId });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>{t('booking.options')}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
        {OPTIONS.map((opt) => {
          const active = selected.includes(opt.id);
          return (
            <Pressable key={opt.id} style={[styles.card, active && styles.cardActive]} onPress={() => toggle(opt.id)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{opt.label}</Text>
                <Text style={styles.cardDesc}>{opt.desc}</Text>
                <Text style={styles.cardPrice}>+ {formatMoney(opt.priceMinor, 'EUR')}/jour</Text>
              </View>
              <Ionicons name={active ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={active ? colors.gold : colors.textMuted} />
            </Pressable>
          );
        })}
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton label={t('common.next')} onPress={proceed} />
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
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.cardBorder },
});
