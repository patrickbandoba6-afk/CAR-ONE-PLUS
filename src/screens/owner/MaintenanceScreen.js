import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import { fetchOwnerVehicles } from '../../lib/api/vehicles';

export default function MaintenanceScreen({ navigation }) {
  const { t } = useTranslation();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    let active = true;
    fetchOwnerVehicles().then((vehicles) => {
      if (!active || !vehicles[0]) return;
      setRecords([{ id: 'm1', vehicle: vehicles[0], reason: 'Vidange + révision', date: '28 sept. 2026' }]);
    });
    return () => { active = false; };
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>{t('owner.maintenance')}</Text>
        <Ionicons name="add-circle-outline" size={24} color={colors.gold} />
      </View>
      <FlatList
        data={records}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListEmptyComponent={<Text style={styles.empty}>Aucune maintenance planifiée. Un véhicule en maintenance est automatiquement retiré des disponibilités.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Ionicons name="construct-outline" size={20} color={colors.gold} />
            <View style={{ flex: 1 }}>
              <Text style={styles.vehicleName}>{item.vehicle.make} {item.vehicle.model}</Text>
              <Text style={styles.reason}>{item.reason}</Text>
            </View>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  empty: { ...typography.bodyMuted, textAlign: 'center', marginTop: 40, lineHeight: 20 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14 },
  vehicleName: { ...typography.body, fontWeight: '700' },
  reason: { ...typography.caption, marginTop: 2 },
  date: { ...typography.caption },
});
