import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import { searchVehicles } from '../../data/vehicles';
import VehicleCard from '../../components/VehicleCard';
import { useAppState } from '../../context/AppStateContext';

export default function ResultsScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { searchFilters } = useAppState();
  const [view, setView] = useState('list');
  const results = searchVehicles(searchFilters);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>{route.params?.categoryLabel || t('search.title')}</Text>
        <Pressable onPress={() => navigation.navigate('Filters')}><Ionicons name="options-outline" size={22} color={colors.gold} /></Pressable>
      </View>
      <View style={styles.toggleRow}>
        <Text style={styles.resultCount}>{results.length} {t('search.results')}</Text>
        <Pressable style={styles.mapToggle} onPress={() => (view === 'list' ? setView('map') : setView('list'))}>
          <Ionicons name={view === 'list' ? 'map-outline' : 'list-outline'} size={16} color={colors.gold} />
          <Text style={styles.mapToggleText}>{view === 'list' ? 'Carte' : 'Liste'}</Text>
        </Pressable>
      </View>
      {view === 'map' ? (
        <Pressable style={{ flex: 1 }} onPress={() => navigation.navigate('Map', { vehicles: results })}>
          <View style={styles.mapPreview}>
            <Ionicons name="map" size={48} color={colors.gold} />
            <Text style={styles.mapPreviewText}>Voir {results.length} véhicules sur la carte</Text>
          </View>
        </Pressable>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(v) => v.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ padding: 20, gap: 12 }}
          renderItem={({ item }) => (
            <VehicleCard vehicle={item} style={{ flex: 1 }} onPress={() => navigation.navigate('VehicleDetail', { vehicleId: item.id })} />
          )}
          ListEmptyComponent={<Text style={styles.empty}>Aucun véhicule ne correspond à votre recherche.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3, flex: 1, textAlign: 'center' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 8 },
  resultCount: { ...typography.bodyMuted },
  mapToggle: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mapToggleText: { color: colors.gold, fontWeight: '700', fontSize: 13 },
  mapPreview: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: colors.bgElevated, margin: 20, borderRadius: radii.lg },
  mapPreviewText: { ...typography.bodyMuted },
  empty: { ...typography.bodyMuted, textAlign: 'center', marginTop: 60 },
});
