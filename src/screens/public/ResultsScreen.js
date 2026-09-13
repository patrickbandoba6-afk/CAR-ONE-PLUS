import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Image, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { colors, typography, radii } from '../../theme/colors';
import { fetchVehicles } from '../../lib/api/vehicles';
import VehicleCard from '../../components/VehicleCard';
import { useAppState } from '../../context/AppStateContext';
import { formatMoney } from '../../utils/format';

const DEFAULT_REGION = { latitude: 33.5731, longitude: -7.5898, latitudeDelta: 6, longitudeDelta: 6 };

export default function ResultsScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { searchFilters, setBookingDraft } = useAppState();
  const [view, setView] = useState('list');
  const [results, setResults] = useState([]);

  useEffect(() => {
    let active = true;
    fetchVehicles(searchFilters).then((vehicles) => { if (active) setResults(vehicles); });
    return () => { active = false; };
  }, [searchFilters]);

  const located = results.filter((v) => v.lat != null && v.lng != null);

  // Tap sur un repère = réservation directe, comme sur MapScreen.js.
  const reserve = (vehicle) => {
    setBookingDraft({ vehicleId: vehicle.id, vehicle, days: 1, protection: false, options: [] });
    navigation.navigate('PriceDetails', { vehicleId: vehicle.id });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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
        <MapView
          style={{ flex: 1 }}
          provider={PROVIDER_DEFAULT}
          initialRegion={DEFAULT_REGION}
          showsUserLocation
          showsMyLocationButton
        >
          {located.map((v) => (
            <Marker key={v.id} coordinate={{ latitude: v.lat, longitude: v.lng }} onPress={() => reserve(v)}>
              <View style={styles.pin}>
                {v.photo ? <Image source={{ uri: v.photo }} style={styles.pinPhoto} /> : null}
                <Text style={styles.pinText}>{formatMoney(v.priceDayMinor, v.currency)}</Text>
              </View>
            </Marker>
          ))}
        </MapView>
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
  pin: { alignItems: 'center', gap: 4 },
  pinPhoto: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: colors.gold },
  pinText: { backgroundColor: colors.gold, color: colors.bg, fontWeight: '800', fontSize: 10, borderRadius: radii.pill, paddingHorizontal: 7, paddingVertical: 3, borderWidth: 2, borderColor: colors.bg },
  empty: { ...typography.bodyMuted, textAlign: 'center', marginTop: 60 },
});
