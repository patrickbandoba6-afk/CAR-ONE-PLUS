import React from 'react';
import { View, Text, Image, Pressable, FlatList, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../../theme/colors';
import { getVehicleById } from '../../data/vehicles';

export default function GalleryScreen({ navigation, route }) {
  const vehicle = getVehicleById(route.params.vehicleId);
  const { width } = useWindowDimensions();
  const photos = vehicle?.photo ? [vehicle.photo] : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="close" size={26} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>{vehicle?.make} {vehicle?.model}</Text>
        <View style={{ width: 26 }} />
      </View>
      {photos.length === 0 ? (
        <View style={styles.empty}><Ionicons name="images-outline" size={48} color={colors.textMuted} /><Text style={styles.emptyText}>Aucune photo disponible pour l'instant</Text></View>
      ) : (
        <FlatList
          data={photos}
          horizontal
          pagingEnabled
          keyExtractor={(uri, i) => uri + i}
          renderItem={({ item }) => <Image source={{ uri: item }} style={{ width, aspectRatio: 1 }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { ...typography.h3 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText: { ...typography.bodyMuted },
});
