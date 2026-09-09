import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import PrimaryButton from '../../components/PrimaryButton';

export default function ActiveRentalScreen({ navigation, route }) {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('booking.inProgress')}</Text>
        <View style={styles.liveBadge}><View style={styles.liveDot} /><Text style={styles.liveText}>En cours</Text></View>
      </View>
      <Pressable style={styles.mapCard} onPress={() => navigation.navigate('TripMap', route.params)}>
        <Ionicons name="map-outline" size={36} color={colors.gold} />
        <Text style={styles.mapCardText}>Voir la carte du trajet</Text>
      </Pressable>
      <View style={styles.grid}>
        <ActionTile icon="key-outline" label="Accès digital" onPress={() => navigation.navigate('DigitalAccess', route.params)} />
        <ActionTile icon="headset-outline" label={t('booking.assistance')} onPress={() => navigation.navigate('Assistance', route.params)} />
        <ActionTile icon="alert-circle-outline" label="Incident" onPress={() => navigation.navigate('Incident', route.params)} />
      </View>
      <View style={{ flex: 1 }} />
      <View style={styles.footer}>
        <PrimaryButton label={t('booking.checkOut')} onPress={() => navigation.navigate('CheckOut', route.params)} />
      </View>
    </SafeAreaView>
  );
}

function ActionTile({ icon, label, onPress }) {
  return (
    <Pressable style={styles.tile} onPress={onPress}>
      <Ionicons name={icon} size={22} color={colors.gold} />
      <Text style={styles.tileLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { ...typography.h1, fontSize: 22 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.card, borderRadius: radii.pill, paddingHorizontal: 10, paddingVertical: 6 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.green },
  liveText: { color: colors.green, fontSize: 11, fontWeight: '700' },
  mapCard: { marginHorizontal: 20, height: 160, backgroundColor: colors.bgElevated, borderRadius: radii.lg, alignItems: 'center', justifyContent: 'center', gap: 8 },
  mapCardText: { ...typography.bodyMuted },
  grid: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginTop: 20 },
  tile: { flex: 1, aspectRatio: 1, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, alignItems: 'center', justifyContent: 'center', gap: 8 },
  tileLabel: { ...typography.caption, textAlign: 'center', color: colors.textSecondary },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.cardBorder },
});
