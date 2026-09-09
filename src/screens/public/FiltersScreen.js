import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppState } from '../../context/AppStateContext';

const TRANSMISSIONS = [{ id: 'auto', label: 'Automatique' }, { id: 'manual', label: 'Manuelle' }];
const FUELS = [{ id: 'petrol', label: 'Essence' }, { id: 'diesel', label: 'Diesel' }, { id: 'electric', label: 'Électrique' }, { id: 'hybrid', label: 'Hybride' }];

export default function FiltersScreen({ navigation }) {
  const { t } = useTranslation();
  const { searchFilters, setSearchFilters } = useAppState();
  const [transmission, setTransmission] = useState(searchFilters.transmission);
  const [fuel, setFuel] = useState(searchFilters.fuel);
  const [instantOnly, setInstantOnly] = useState(searchFilters.instantBookingOnly);

  const apply = () => {
    setSearchFilters((prev) => ({ ...prev, transmission, fuel, instantBookingOnly: instantOnly }));
    navigation.goBack();
  };

  const reset = () => { setTransmission(null); setFuel(null); setInstantOnly(false); };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="close" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>{t('filters.title')}</Text>
        <Pressable onPress={reset}><Text style={styles.reset}>{t('filters.reset')}</Text></Pressable>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 22 }}>
        <View>
          <Text style={styles.sectionTitle}>{t('filters.transmission')}</Text>
          <View style={styles.chipsRow}>
            {TRANSMISSIONS.map((opt) => (
              <Pressable key={opt.id} style={[styles.chip, transmission === opt.id && styles.chipActive]} onPress={() => setTransmission(transmission === opt.id ? null : opt.id)}>
                <Text style={[styles.chipText, transmission === opt.id && styles.chipTextActive]}>{opt.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View>
          <Text style={styles.sectionTitle}>{t('filters.fuel')}</Text>
          <View style={styles.chipsRow}>
            {FUELS.map((opt) => (
              <Pressable key={opt.id} style={[styles.chip, fuel === opt.id && styles.chipActive]} onPress={() => setFuel(fuel === opt.id ? null : opt.id)}>
                <Text style={[styles.chipText, fuel === opt.id && styles.chipTextActive]}>{opt.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={styles.switchRow}>
          <View>
            <Text style={styles.sectionTitle}>{t('filters.instantBooking')}</Text>
            <Text style={styles.switchHint}>Réservez sans attendre la validation du propriétaire</Text>
          </View>
          <Switch value={instantOnly} onValueChange={setInstantOnly} trackColor={{ true: colors.gold, false: colors.cardBorder }} thumbColor={colors.white} />
        </View>
        {['digitalKey', 'delivery'].map((k) => (
          <View key={k} style={styles.switchRow}>
            <Text style={styles.sectionTitle}>{t(`filters.${k}`)}</Text>
            <Ionicons name="lock-closed-outline" size={16} color={colors.textMuted} />
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton label={t('filters.apply')} onPress={apply} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  reset: { color: colors.gold, fontWeight: '700' },
  sectionTitle: { ...typography.h3, marginBottom: 10 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 16, height: 40, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.cardBorder, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  chipActive: { borderColor: colors.gold, backgroundColor: colors.bgElevated },
  chipText: { color: colors.textSecondary, fontWeight: '600', fontSize: 13 },
  chipTextActive: { color: colors.gold },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  switchHint: { ...typography.caption, maxWidth: 240, marginTop: 4 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.cardBorder },
});
