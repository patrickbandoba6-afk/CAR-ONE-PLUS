import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import { fetchVehiclesByIds } from '../../lib/api/vehicles';
import { formatMoney, formatDate } from '../../utils/format';
import { useAppState } from '../../context/AppStateContext';

const STATUS_LABEL = { pending_approval: 'En attente', confirmed: 'Confirmée', active: 'En cours', completed: 'Terminée', cancelled: 'Annulée' };
const STATUS_COLOR = { pending_approval: colors.amber, confirmed: colors.green, active: colors.gold, completed: colors.textMuted, cancelled: colors.red };

export default function BookingsListScreen({ navigation }) {
  const { t } = useTranslation();
  const { bookings } = useAppState();
  const [vehiclesById, setVehiclesById] = useState({});

  useEffect(() => {
    let active = true;
    fetchVehiclesByIds(bookings.map((b) => b.vehicleId)).then((map) => { if (active) setVehiclesById(map); });
    return () => { active = false; };
  }, [bookings]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Text style={styles.title}>{t('nav.bookings')}</Text>
      <FlatList
        data={bookings}
        keyExtractor={(b) => b.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListEmptyComponent={<Text style={styles.empty}>Aucune réservation pour le moment.</Text>}
        renderItem={({ item }) => {
          const vehicle = vehiclesById[item.vehicleId];
          if (!vehicle) return null;
          return (
            <Pressable style={styles.card} onPress={() => navigation.navigate('BookingDetail', { bookingId: item.id })}>
              <View style={{ flex: 1 }}>
                <Text style={styles.vehicleName}>{vehicle.make} {vehicle.model}</Text>
                <Text style={styles.dates}>{formatDate(item.startsAt)} → {formatDate(item.endsAt)}</Text>
                <Text style={styles.total}>{formatMoney(item.totalMinor, item.currency)}</Text>
              </View>
              <View style={[styles.statusBadge, { borderColor: STATUS_COLOR[item.status] }]}>
                <Text style={[styles.statusText, { color: STATUS_COLOR[item.status] }]}>{STATUS_LABEL[item.status]}</Text>
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { ...typography.h1, paddingHorizontal: 20, paddingTop: 8 },
  empty: { ...typography.bodyMuted, textAlign: 'center', marginTop: 60 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 16 },
  vehicleName: { ...typography.h3 },
  dates: { ...typography.caption, marginTop: 4 },
  total: { color: colors.gold, fontWeight: '700', marginTop: 6 },
  statusBadge: { borderWidth: 1, borderRadius: radii.pill, paddingHorizontal: 10, paddingVertical: 5 },
  statusText: { fontSize: 11, fontWeight: '700' },
});
