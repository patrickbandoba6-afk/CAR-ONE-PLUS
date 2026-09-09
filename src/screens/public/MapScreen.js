import React from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii } from '../../theme/colors';
import { DEMO_VEHICLES } from '../../data/vehicles';
import { formatMoney } from '../../utils/format';

// Fournisseur cartographique non encore sélectionné (04_ARCHITECTURE_TECHNIQUE.md) :
// cette vue liste les véhicules géolocalisés en attendant l'intégration d'une carte réelle.
export default function MapScreen({ navigation, route }) {
  const vehicles = route.params?.vehicles || DEMO_VEHICLES;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>Carte</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.mapArea}>
        <Ionicons name="map-outline" size={40} color={colors.textMuted} />
        <Text style={styles.mapNote}>Carte interactive à venir — fournisseur cartographique en cours de sélection.</Text>
      </View>
      <FlatList
        data={vehicles}
        keyExtractor={(v) => v.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item }) => (
          <Pressable style={styles.pinCard} onPress={() => navigation.navigate('VehicleDetail', { vehicleId: item.id })}>
            <Ionicons name="location" size={16} color={colors.gold} />
            <Text style={styles.pinTitle} numberOfLines={1}>{item.make} {item.model}</Text>
            <Text style={styles.pinPrice}>{formatMoney(item.priceDayMinor, item.currency)}/jour</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  mapArea: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: colors.bgElevated, marginHorizontal: 20, borderRadius: radii.lg },
  mapNote: { ...typography.bodyMuted, textAlign: 'center', paddingHorizontal: 40 },
  pinCard: { width: 160, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 12, gap: 4 },
  pinTitle: { ...typography.h3, fontSize: 13 },
  pinPrice: { ...typography.caption, color: colors.gold, fontWeight: '700' },
});
