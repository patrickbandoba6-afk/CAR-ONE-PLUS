import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../../theme/colors';

export default function TripMapScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>Trajet</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.mapArea}>
        <Ionicons name="navigate-outline" size={40} color={colors.textMuted} />
        <Text style={styles.mapNote}>Suivi de trajet disponible une fois le véhicule équipé d'un boîtier télématique (Phase 2 de la roadmap).</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  mapArea: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: colors.bgElevated, margin: 20, borderRadius: 22 },
  mapNote: { ...typography.bodyMuted, textAlign: 'center', paddingHorizontal: 40 },
});
