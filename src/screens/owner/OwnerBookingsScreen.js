import React from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import { getVehicleById } from '../../data/vehicles';
import { formatMoney, formatDate } from '../../utils/format';
import { useAppState } from '../../context/AppStateContext';

export default function OwnerBookingsScreen() {
  const { t } = useTranslation();
  const { bookings } = useAppState();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>{t('owner.bookings')}</Text>
      <FlatList
        data={bookings}
        keyExtractor={(b) => b.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListEmptyComponent={<Text style={styles.empty}>Aucune réservation reçue pour l'instant.</Text>}
        renderItem={({ item }) => {
          const vehicle = getVehicleById(item.vehicleId);
          if (!vehicle) return null;
          return (
            <View style={styles.card}>
              <Text style={styles.vehicleName}>{vehicle.make} {vehicle.model}</Text>
              <Text style={styles.dates}>{formatDate(item.startsAt)} → {formatDate(item.endsAt)}</Text>
              <Text style={styles.total}>{formatMoney(item.totalMinor, item.currency)}</Text>
              {item.status === 'pending_approval' && (
                <View style={styles.actionsRow}>
                  <Pressable style={[styles.actionBtn, styles.decline]}><Text style={styles.declineText}>Refuser</Text></Pressable>
                  <Pressable style={[styles.actionBtn, styles.accept]}><Text style={styles.acceptText}>Accepter</Text></Pressable>
                </View>
              )}
            </View>
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
  card: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 16, gap: 4 },
  vehicleName: { ...typography.h3 },
  dates: { ...typography.caption },
  total: { color: colors.gold, fontWeight: '700', marginTop: 4 },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  actionBtn: { flex: 1, height: 38, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  decline: { borderWidth: 1, borderColor: colors.cardBorder },
  declineText: { color: colors.textSecondary, fontWeight: '700', fontSize: 13 },
  accept: { backgroundColor: colors.gold },
  acceptText: { color: colors.bg, fontWeight: '700', fontSize: 13 },
});
