import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { colors, typography } from '../../theme/colors';
import { fetchVehicles } from '../../lib/api/vehicles';
import VehicleCard from '../../components/VehicleCard';
import { useAppState } from '../../context/AppStateContext';

export default function FavoritesScreen({ navigation }) {
  const { t } = useTranslation();
  const { favorites } = useAppState();
  const [all, setAll] = useState([]);

  useEffect(() => {
    let active = true;
    fetchVehicles({}).then((v) => { if (active) setAll(v); });
    return () => { active = false; };
  }, []);

  const vehicles = all.filter((v) => favorites.includes(v.id));

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Text style={styles.title}>{t('nav.favorites')}</Text>
      <FlatList
        data={vehicles}
        keyExtractor={(v) => v.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListEmptyComponent={<Text style={styles.empty}>Ajoutez des véhicules à vos favoris pour les retrouver ici.</Text>}
        renderItem={({ item }) => (
          <VehicleCard vehicle={item} style={{ flex: 1 }} onPress={() => navigation.navigate('VehicleDetail', { vehicleId: item.id })} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { ...typography.h1, paddingHorizontal: 20, paddingTop: 8 },
  empty: { ...typography.bodyMuted, textAlign: 'center', marginTop: 60, paddingHorizontal: 30 },
});
