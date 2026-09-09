import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';

const STATS = [
  { label: 'Taux d\'occupation', value: '68%' },
  { label: 'Note moyenne', value: '4.8 / 5' },
  { label: 'Taux d\'annulation', value: '3%' },
  { label: 'Réservations instantanées', value: '72%' },
];

export default function StatsScreen({ navigation }) {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>{t('owner.stats')}</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.grid}>
        {STATS.map((s) => (
          <View key={s.label} style={styles.card}>
            <Text style={styles.value}>{s.value}</Text>
            <Text style={styles.label}>{s.label}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 20 },
  card: { width: '47%', backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 16, gap: 6 },
  value: { color: colors.gold, fontWeight: '800', fontSize: 22 },
  label: { ...typography.caption },
});
