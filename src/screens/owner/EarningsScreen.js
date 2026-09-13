import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import { formatMoney } from '../../utils/format';

const HISTORY = [
  { id: 1, label: 'Location Mercedes GLE', date: '15 sept.', amountMinor: 25365, net: true },
  { id: 2, label: 'Location Peugeot 208', date: '2 sept.', amountMinor: 7410, net: true },
  { id: 3, label: 'Commission CAR ONE PLUS (5%)', date: '2 sept.', amountMinor: -390, net: false },
];

export default function EarningsScreen({ navigation }) {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>{t('owner.earnings')}</Text>
        <Pressable onPress={() => navigation.navigate('Payouts')}><Ionicons name="wallet-outline" size={22} color={colors.gold} /></Pressable>
      </View>
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Revenus nets (30 derniers jours)</Text>
        <Text style={styles.totalValue}>{formatMoney(184000, 'EUR')}</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 10 }}>
        {HISTORY.map((h) => (
          <View key={h.id} style={styles.row}>
            <Text style={styles.rowLabel}>{h.label}</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.rowValue, !h.net && { color: colors.red }]}>{h.amountMinor > 0 ? '+' : ''}{formatMoney(h.amountMinor, 'EUR')}</Text>
              <Text style={styles.rowDate}>{h.date}</Text>
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
  totalCard: { marginHorizontal: 20, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 18, alignItems: 'center', gap: 4 },
  totalLabel: { ...typography.caption },
  totalValue: { color: colors.gold, fontWeight: '800', fontSize: 26 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14 },
  rowLabel: { ...typography.body, flex: 1, marginRight: 10 },
  rowValue: { color: colors.green, fontWeight: '700' },
  rowDate: { ...typography.caption, marginTop: 2 },
});
