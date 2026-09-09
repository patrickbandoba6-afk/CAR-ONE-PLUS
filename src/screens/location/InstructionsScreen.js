import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii } from '../../theme/colors';

const STEPS = [
  { icon: 'location-outline', text: 'Rendez-vous au point de remise indiqué par le propriétaire, 10 minutes avant l\'heure prévue.' },
  { icon: 'card-outline', text: 'Présentez votre pièce d\'identité et votre permis vérifiés dans l\'app.' },
  { icon: 'camera-outline', text: 'Réalisez l\'état des lieux de départ guidé (check-in) avant de prendre la route.' },
  { icon: 'chatbubbles-outline', text: 'En cas de retard ou d\'imprévu, contactez le loueur via la messagerie de la réservation.' },
];

export default function InstructionsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>Instructions</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={{ padding: 20, gap: 14 }}>
        {STEPS.map((s, i) => (
          <View key={i} style={styles.row}>
            <View style={styles.iconWrap}><Ionicons name={s.icon} size={20} color={colors.gold} /></View>
            <Text style={styles.text}>{s.text}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  row: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  iconWrap: { width: 38, height: 38, borderRadius: radii.sm, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  text: { ...typography.body, flex: 1, lineHeight: 21 },
});
