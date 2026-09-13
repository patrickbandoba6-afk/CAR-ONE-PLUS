import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, Image, FlatList, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii } from '../../theme/colors';
import { useAppState } from '../../context/AppStateContext';
import { formatDateTime } from '../../utils/format';
import { DEMO_BOOKINGS } from '../../data/demoUser';
import { getVehicleById } from '../../data/vehicles';

const PHASE_LABEL = { check_in: 'État des lieux — départ', check_out: 'État des lieux — retour' };

// Le locataire photographie chaque zone du véhicule avant de partir (et au
// retour) — voir CheckInOutScreen.js. Ces photos doivent être consultables
// par le propriétaire du bien : c'est cet écran qui les rend visibles côté
// Professionnel, plutôt que de les laisser dormir dans l'état local.
export default function InspectionsScreen({ navigation }) {
  const { inspections } = useAppState();
  const [preview, setPreview] = useState(null);

  const rows = useMemo(() => inspections.map((insp) => {
    const booking = DEMO_BOOKINGS.find((b) => b.id === insp.bookingId);
    const vehicle = booking ? getVehicleById(booking.vehicleId) : null;
    return { ...insp, vehicleLabel: vehicle ? `${vehicle.make} ${vehicle.model}` : (insp.bookingId ? `Réservation ${insp.bookingId}` : 'Réservation') };
  }), [inspections]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>États des lieux</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={rows}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ padding: 20, gap: 14 }}
        ListEmptyComponent={<Text style={styles.empty}>Aucun état des lieux transmis pour l'instant. Ils apparaîtront ici dès qu'un locataire photographie un véhicule au départ ou au retour.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.vehicleLabel}>{item.vehicleLabel}</Text>
                <Text style={styles.phaseLabel}>{PHASE_LABEL[item.phase] || item.phase}</Text>
              </View>
              <Text style={styles.date}>{formatDateTime(item.completedAt)}</Text>
            </View>
            <View style={styles.photosRow}>
              {item.photos?.map((p, i) => (
                <Pressable key={i} onPress={() => setPreview(p)}>
                  <Image source={{ uri: p.uri }} style={styles.thumb} />
                </Pressable>
              ))}
            </View>
          </View>
        )}
      />

      <Modal visible={!!preview} transparent animationType="fade" onRequestClose={() => setPreview(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setPreview(null)}>
          {preview && (
            <View style={styles.modalCard}>
              <Image source={{ uri: preview.uri }} style={styles.modalImage} resizeMode="contain" />
              <Text style={styles.modalLabel}>{preview.label}</Text>
            </View>
          )}
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3, flex: 1, textAlign: 'center' },
  empty: { ...typography.bodyMuted, textAlign: 'center', marginTop: 60, lineHeight: 20 },
  card: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14, gap: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  vehicleLabel: { ...typography.body, fontWeight: '700' },
  phaseLabel: { ...typography.caption, color: colors.gold, marginTop: 2, fontWeight: '700' },
  date: { ...typography.caption },
  photosRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  thumb: { width: 64, height: 64, borderRadius: radii.sm },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(5,7,12,0.85)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalCard: { width: '100%', gap: 10 },
  modalImage: { width: '100%', height: 360, borderRadius: radii.md },
  modalLabel: { ...typography.body, color: colors.white, textAlign: 'center', fontWeight: '600' },
});
