import React from 'react';
import { View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii } from '../../theme/colors';

export default function AssistanceScreen({ navigation, route }) {
  const OPTIONS = [
    { icon: 'call-outline', label: 'Appeler l\'assistance CAR ONE PLUS', desc: 'Disponible 24/7', action: () => Linking.openURL('mailto:support@caroneplus.com?subject=Assistance%20urgente') },
    { icon: 'chatbubbles-outline', label: 'Contacter le loueur', desc: 'Réponse habituelle sous quelques minutes', action: () => Linking.openURL('mailto:support@caroneplus.com?subject=Message%20au%20loueur') },
    { icon: 'construct-outline', label: 'Panne / dépannage', desc: 'Déclenchez une intervention', action: () => navigation.navigate('Incident', route.params) },
    { icon: 'alert-circle-outline', label: 'Déclarer un incident', desc: 'Accident, vol, dommage', action: () => navigation.navigate('Incident', route.params) },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>Assistance</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={{ padding: 20, gap: 12 }}>
        {OPTIONS.map((o) => (
          <Pressable
            key={o.label}
            style={styles.row}
            onPress={o.action}
          >
            <View style={styles.iconWrap}><Ionicons name={o.icon} size={20} color={colors.gold} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>{o.label}</Text>
              <Text style={styles.rowDesc}>{o.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14 },
  iconWrap: { width: 40, height: 40, borderRadius: radii.sm, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { ...typography.body, fontWeight: '700' },
  rowDesc: { ...typography.caption, marginTop: 2 },
});
