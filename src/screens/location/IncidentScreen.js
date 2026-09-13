import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii } from '../../theme/colors';
import PrimaryButton from '../../components/PrimaryButton';

// Centre de résolution — 03_SPEC_FONCTIONNELLE.md :
// déclaration → photos → chronologie → estimation → décision → suivi.
const TIMELINE = [
  { label: 'Dossier ouvert', done: true },
  { label: 'Éléments reçus (photos, description)', done: true },
  { label: 'En cours d\'examen', done: false },
  { label: 'Décision communiquée', done: false },
];

export default function IncidentScreen({ navigation, route }) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>Incident</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={{ padding: 20, gap: 20 }}>
        <PrimaryButton label="Déclarer un nouvel incident" onPress={() => navigation.navigate('AddDamage', route.params)} />
        <View>
          <Text style={styles.sectionTitle}>Suivi du dossier</Text>
          {TIMELINE.map((step, i) => (
            <View key={step.label} style={styles.timelineRow}>
              <View style={[styles.dot, step.done && styles.dotDone]} />
              <Text style={[styles.timelineLabel, !step.done && { color: colors.textMuted }]}>{step.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  sectionTitle: { ...typography.h3, marginBottom: 14 },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.cardBorder },
  dotDone: { backgroundColor: colors.gold },
  timelineLabel: { ...typography.body },
});
