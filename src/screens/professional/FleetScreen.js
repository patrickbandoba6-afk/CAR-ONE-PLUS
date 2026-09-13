import React from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii } from '../../theme/colors';
import { CATEGORY_LABELS } from '../../data/categories';
import { useAppState } from '../../context/AppStateContext';
import { formatMoney } from '../../utils/format';

const STATUS_LABEL = { pending_moderation: 'En modération', active: 'Publiée', paused: 'En pause', maintenance: 'Maintenance' };
const STATUS_COLOR = { pending_moderation: colors.amber, active: colors.green, paused: colors.textMuted, maintenance: colors.red };

// Flotte du professionnel — tous types de biens confondus (voitures, camions,
// avions, jets privés, yachts, vélos, trottinettes...), alimentée par le même
// assistant que le particulier (AddVehicleScreen → myListings).
export default function FleetScreen({ navigation }) {
  const { myListings } = useAppState();
  const listings = myListings.filter((l) => l.ownerKind === 'professional');
  const grouped = listings.reduce((acc, l) => {
    acc[l.category] = acc[l.category] || [];
    acc[l.category].push(l);
    return acc;
  }, {});
  const categoryKeys = Object.keys(grouped);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Ma flotte</Text>
        <Pressable onPress={() => navigation.navigate('AddVehicle')}><Ionicons name="add-circle" size={28} color={colors.gold} /></Pressable>
      </View>

      {listings.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="car-sport-outline" size={40} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Aucun bien pour l'instant</Text>
          <Text style={styles.emptyBody}>Voitures, camions, avions, jets privés, yachts, vélos, trottinettes... ajoutez tout type de bien avec ses photos, documents et tarifs.</Text>
          <Pressable style={styles.emptyBtn} onPress={() => navigation.navigate('AddVehicle')}>
            <Text style={styles.emptyBtnText}>Ajouter un bien</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={categoryKeys}
          keyExtractor={(k) => k}
          contentContainerStyle={{ padding: 20, gap: 20 }}
          renderItem={({ item: catKey }) => (
            <View>
              <Text style={styles.groupTitle}>{CATEGORY_LABELS[catKey] || catKey} · {grouped[catKey].length}</Text>
              <View style={{ gap: 10 }}>
                {grouped[catKey].map((l) => (
                  <View key={l.id} style={styles.card}>
                    <View style={styles.photo}><Ionicons name="car-sport" size={20} color={colors.textMuted} /></View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.name}>{l.make} {l.model}</Text>
                      <Text style={styles.price}>{formatMoney(l.priceDayMinor, l.currency)}/jour</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: `${STATUS_COLOR[l.status]}22` }]}>
                      <Text style={[styles.statusText, { color: STATUS_COLOR[l.status] }]}>{STATUS_LABEL[l.status] || l.status}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8 },
  title: { ...typography.h1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 10 },
  emptyTitle: { ...typography.h2, fontSize: 18, textAlign: 'center' },
  emptyBody: { ...typography.bodyMuted, textAlign: 'center', lineHeight: 19 },
  emptyBtn: { marginTop: 10, backgroundColor: colors.gold, borderRadius: radii.pill, paddingHorizontal: 22, height: 46, alignItems: 'center', justifyContent: 'center' },
  emptyBtnText: { color: colors.bg, fontWeight: '800' },
  groupTitle: { ...typography.h3, fontSize: 14, marginBottom: 10, color: colors.gold },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14 },
  photo: { width: 44, height: 44, borderRadius: radii.sm, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' },
  name: { ...typography.body, fontWeight: '700' },
  price: { ...typography.caption, marginTop: 2 },
  statusBadge: { borderRadius: radii.sm, paddingHorizontal: 8, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },
});
