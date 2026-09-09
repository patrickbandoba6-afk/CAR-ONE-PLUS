import React from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import { formatMoney, formatDate } from '../../utils/format';

const PAYOUTS = [
  { id: 'p1', date: '2026-09-01T00:00:00Z', amountMinor: 68000, status: 'paid' },
  { id: 'p2', date: '2026-08-01T00:00:00Z', amountMinor: 54200, status: 'paid' },
  { id: 'p3', date: '2026-09-15T00:00:00Z', amountMinor: 25365, status: 'pending' },
];

export default function PayoutsScreen({ navigation }) {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>{t('owner.payouts')}</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={PAYOUTS}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: 20, gap: 10 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Ionicons name={item.status === 'paid' ? 'checkmark-circle' : 'time-outline'} size={20} color={item.status === 'paid' ? colors.green : colors.amber} />
            <View style={{ flex: 1 }}>
              <Text style={styles.date}>{formatDate(item.date)}</Text>
              <Text style={styles.status}>{item.status === 'paid' ? 'Versé' : 'En attente'}</Text>
            </View>
            <Text style={styles.amount}>{formatMoney(item.amountMinor, 'EUR')}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14 },
  date: { ...typography.body, fontWeight: '700' },
  status: { ...typography.caption, marginTop: 2 },
  amount: { color: colors.gold, fontWeight: '800' },
});
