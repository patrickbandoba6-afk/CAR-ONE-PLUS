import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppState } from '../../context/AppStateContext';

export default function SearchScreen({ navigation }) {
  const { t } = useTranslation();
  const { searchFilters, setSearchFilters } = useAppState();
  const [query, setQuery] = useState(searchFilters.query);

  const runSearch = () => {
    setSearchFilters((prev) => ({ ...prev, query }));
    navigation.navigate('Results', {});
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>{t('search.title')}</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
        <View style={styles.inputRow}>
          <Ionicons name="location-outline" size={18} color={colors.gold} />
          <TextInput
            style={styles.input}
            placeholder="Destination, ville, aéroport..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
        </View>
        <View style={styles.dateRow}>
          <Pressable style={[styles.dateBox, { marginRight: 8 }]}>
            <Text style={styles.dateLabel}>{t('search.dateStart')}</Text>
            <Text style={styles.dateValue}>Aujourd'hui, 09:00</Text>
          </Pressable>
          <Pressable style={styles.dateBox}>
            <Text style={styles.dateLabel}>{t('search.dateEnd')}</Text>
            <Text style={styles.dateValue}>Demain, 09:00</Text>
          </Pressable>
        </View>
        <Pressable style={styles.filtersLink} onPress={() => navigation.navigate('Filters')}>
          <Ionicons name="options-outline" size={18} color={colors.gold} />
          <Text style={styles.filtersLinkText}>{t('search.filters')}</Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <PrimaryButton label={t('search.title')} onPress={runSearch} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  content: { flex: 1, padding: 20, gap: 14 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, paddingHorizontal: 14, height: 52 },
  input: { flex: 1, color: colors.white, fontSize: 15 },
  dateRow: { flexDirection: 'row' },
  dateBox: { flex: 1, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14, gap: 4 },
  dateLabel: { ...typography.caption },
  dateValue: { ...typography.body, fontWeight: '700' },
  filtersLink: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  filtersLinkText: { color: colors.gold, fontWeight: '700' },
});
