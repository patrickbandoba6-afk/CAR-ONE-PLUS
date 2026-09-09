import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii } from '../../theme/colors';
import { getVehicleById } from '../../data/vehicles';
import PrimaryButton from '../../components/PrimaryButton';

// Clé digitale — Phase 2 de la roadmap (nécessite un boîtier télématique compatible
// sur le véhicule, voir TelematicsDevice dans supabase/schema.sql).
export default function DigitalAccessScreen({ navigation, route }) {
  const vehicle = route.params?.vehicleId ? getVehicleById(route.params.vehicleId) : null;
  const available = vehicle?.digitalKey;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>Accès digital</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name={available ? 'lock-open-outline' : 'lock-closed-outline'} size={40} color={colors.gold} />
        </View>
        {available ? (
          <>
            <Text style={styles.title}>Déverrouillez ce véhicule</Text>
            <Text style={styles.body}>Ouvrez et fermez le véhicule directement depuis l'app pendant la durée de votre réservation.</Text>
            <PrimaryButton label="Déverrouiller" onPress={() => {}} style={{ marginTop: 20 }} />
          </>
        ) : (
          <>
            <Text style={styles.title}>Non disponible pour ce véhicule</Text>
            <Text style={styles.body}>Ce véhicule n'est pas encore équipé d'un boîtier connecté. La remise se fait en main propre selon les instructions de la réservation.</Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 10 },
  iconWrap: { width: 76, height: 76, borderRadius: radii.lg, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  title: { ...typography.h2, textAlign: 'center' },
  body: { ...typography.bodyMuted, textAlign: 'center', lineHeight: 20 },
});
