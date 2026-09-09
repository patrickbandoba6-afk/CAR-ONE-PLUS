import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import PrimaryButton from '../../components/PrimaryButton';

const CHECKLIST = [
  { key: 'exterior', icon: 'car-outline', label: '4 côtés du véhicule' },
  { key: 'wheels', icon: 'ellipse-outline', label: 'Roues / pneus' },
  { key: 'interior', icon: 'aperture-outline', label: 'Intérieur' },
  { key: 'dashboard', icon: 'speedometer-outline', label: 'Compteur kilométrique' },
  { key: 'fuel', icon: 'flash-outline', label: 'Carburant / batterie' },
];

// Sert au check-in (départ) et au check-out (retour) — 03_SPEC_FONCTIONNELLE.md :
// les deux phases partagent le même parcours guidé (entité Inspection, champ phase).
export default function CheckInOutScreen({ navigation, route }) {
  const { t } = useTranslation();
  const phase = route.name === 'CheckOut' ? 'check_out' : 'check_in';
  const [done, setDone] = useState({});
  const toggle = (key) => setDone((prev) => ({ ...prev, [key]: !prev[key] }));
  const allDone = CHECKLIST.every((c) => done[c.key]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>{phase === 'check_in' ? t('booking.checkIn') : t('booking.checkOut')}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
        <Text style={styles.hint}>Photographiez chaque zone. Les photos sont horodatées et géolocalisées pour votre protection.</Text>
        {CHECKLIST.map((c) => (
          <Pressable key={c.key} style={[styles.row, done[c.key] && styles.rowDone]} onPress={() => toggle(c.key)}>
            <Ionicons name={c.icon} size={20} color={colors.gold} />
            <Text style={styles.rowLabel}>{c.label}</Text>
            <Ionicons name={done[c.key] ? 'checkmark-circle' : 'camera-outline'} size={20} color={done[c.key] ? colors.green : colors.textMuted} />
          </Pressable>
        ))}
        <Pressable style={styles.damageLink} onPress={() => navigation.navigate('AddDamage', route.params)}>
          <Ionicons name="alert-circle-outline" size={18} color={colors.red} />
          <Text style={styles.damageLinkText}>Signaler un dommage existant</Text>
        </Pressable>
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          label={phase === 'check_in' ? 'Valider et démarrer la location' : 'Valider et clôturer'}
          disabled={!allDone}
          onPress={() => navigation.navigate(phase === 'check_in' ? 'ActiveRental' : 'Invoice', route.params)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  hint: { ...typography.caption, lineHeight: 17, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14 },
  rowDone: { borderColor: colors.green },
  rowLabel: { ...typography.body, flex: 1 },
  damageLink: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  damageLinkText: { color: colors.red, fontWeight: '700' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.cardBorder },
});
