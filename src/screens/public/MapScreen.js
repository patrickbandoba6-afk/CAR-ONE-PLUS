import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Image, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { colors, typography, radii, shadow } from '../../theme/colors';
import { fetchVehicles } from '../../lib/api/vehicles';
import { formatMoney } from '../../utils/format';
import { useAppState } from '../../context/AppStateContext';

const DEFAULT_REGION = { latitude: 33.5731, longitude: -7.5898, latitudeDelta: 6, longitudeDelta: 6 };

// Carte géolocalisée — chaque bien publié (véhicule, moto, yacht, aéronef...)
// apparaît où son propriétaire l'a situé, en France comme dans le reste du
// monde ; ce n'est pas limité à une zone (voir data/vehicles.js pour les
// coordonnées démo, actuellement centrées sur le Maroc où opère la flotte).
export default function MapScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { setBookingDraft } = useAppState();
  const [vehicles, setVehicles] = useState(route.params?.vehicles || []);
  const [selectedId, setSelectedId] = useState(null);
  const mapRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (route.params?.vehicles) return;
    let active = true;
    fetchVehicles({}).then((v) => { if (active) setVehicles(v); });
    return () => { active = false; };
  }, [route.params?.vehicles]);

  const located = vehicles.filter((v) => v.lat != null && v.lng != null);

  // Tap sur un repère ou une carte = réservation directe (même pré-remplissage
  // du brouillon que le bouton "Réserver" de VehicleDetailScreen). Un appui
  // long sur la carte du bas reste une échappatoire pour voir la fiche
  // complète avant de réserver.
  const reserve = (vehicle) => {
    setBookingDraft({ vehicleId: vehicle.id, vehicle, days: 1, protection: false, options: [] });
    navigation.navigate('PriceDetails', { vehicleId: vehicle.id });
  };

  const highlight = (vehicle, index) => {
    setSelectedId(vehicle.id);
    mapRef.current?.animateToRegion({ latitude: vehicle.lat, longitude: vehicle.lng, latitudeDelta: 0.15, longitudeDelta: 0.15 }, 300);
    listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={20} color={colors.white} />
          <Text style={styles.backBtnText}>Retour</Text>
        </Pressable>
        <View style={styles.headerBadge}><Text style={styles.headerBadgeText}>{located.length} bien{located.length > 1 ? 's' : ''} localisé{located.length > 1 ? 's' : ''}</Text></View>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={DEFAULT_REGION}
        showsUserLocation
        showsMyLocationButton
      >
        {located.map((v, index) => (
          <Marker
            key={v.id}
            coordinate={{ latitude: v.lat, longitude: v.lng }}
            onPress={() => { highlight(v, index); reserve(v); }}
          >
            <View style={[styles.pin, selectedId === v.id && styles.pinActive]}>
              <Text style={[styles.pinText, selectedId === v.id && styles.pinTextActive]}>{formatMoney(v.priceDayMinor, v.currency)}</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      <FlatList
        ref={listRef}
        data={located}
        keyExtractor={(v) => v.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        getItemLayout={(_, i) => ({ length: 176, offset: 176 * i, index: i })}
        onScrollToIndexFailed={() => {}}
        renderItem={({ item, index }) => (
          <Pressable
            style={[styles.pinCard, shadow, selectedId === item.id && styles.pinCardActive]}
            onPress={() => { highlight(item, index); reserve(item); }}
            onLongPress={() => navigation.navigate('VehicleDetail', { vehicleId: item.id })}
          >
            {item.photo ? (
              <Image source={{ uri: item.photo }} style={styles.pinPhoto} />
            ) : (
              <View style={[styles.pinPhoto, styles.pinPhotoEmpty]}><Ionicons name="car-sport" size={18} color={colors.textMuted} /></View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.pinTitle} numberOfLines={1}>{item.make} {item.model}</Text>
              <Text style={styles.pinLocation} numberOfLines={1}>{item.locationLabel}</Text>
              <Text style={styles.pinPrice}>{formatMoney(item.priceDayMinor, item.currency)}/jour</Text>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 38, borderRadius: 19, backgroundColor: 'rgba(10,13,20,0.85)', paddingLeft: 10, paddingRight: 14 },
  backBtnText: { color: colors.white, fontWeight: '700', fontSize: 13 },
  headerBadge: { backgroundColor: 'rgba(10,13,20,0.75)', borderRadius: radii.pill, paddingHorizontal: 14, paddingVertical: 8 },
  headerBadgeText: { color: colors.white, fontWeight: '700', fontSize: 12 },
  map: { flex: 1 },
  pin: { backgroundColor: colors.gold, borderRadius: radii.pill, paddingHorizontal: 9, paddingVertical: 5, borderWidth: 2, borderColor: colors.bg },
  pinActive: { backgroundColor: colors.bg, borderColor: colors.gold },
  pinText: { color: colors.bg, fontWeight: '800', fontSize: 11 },
  pinTextActive: { color: colors.gold },
  pinCard: { width: 166, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 10 },
  pinCardActive: { borderColor: colors.gold },
  pinPhoto: { width: 40, height: 40, borderRadius: radii.sm },
  pinPhotoEmpty: { backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' },
  pinTitle: { ...typography.caption, color: colors.white, fontWeight: '700' },
  pinLocation: { ...typography.caption, fontSize: 10.5, marginTop: 1 },
  pinPrice: { ...typography.caption, color: colors.gold, fontWeight: '700', marginTop: 2 },
});
