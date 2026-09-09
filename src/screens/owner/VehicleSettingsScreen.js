import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import { getVehicleById } from '../../data/vehicles';
import PrimaryButton from '../../components/PrimaryButton';

// Un seul écran paramétré par route.name pour les réglages d'une annonce
// (Documents / Photos / Tarification / Calendrier / Règles / Mode d'accès —
// écrans 33 à 38 de l'inventaire), pour éviter de dupliquer 6 écrans quasi identiques.
export default function VehicleSettingsScreen({ navigation, route }) {
  const { t } = useTranslation();
  const vehicle = route.params?.vehicleId ? getVehicleById(route.params.vehicleId) : null;
  const section = route.name;
  const [price, setPrice] = useState(vehicle ? String(vehicle.priceDayMinor / 100) : '');
  const [blocked, setBlocked] = useState([]);

  const titles = {
    Documents: t('owner.documents'), Photos: t('owner.photos'), Pricing: t('owner.pricing'),
    Calendar: t('owner.calendar'), Rules: t('owner.rules'), AccessMode: t('owner.accessMode'),
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>{titles[section]}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        {vehicle && <Text style={styles.vehicleName}>{vehicle.make} {vehicle.model}</Text>}

        {section === 'Documents' && (
          <>
            {['Carte grise', 'Attestation d\'assurance', 'Contrôle technique'].map((d) => (
              <Pressable key={d} style={styles.row}>
                <Ionicons name="document-attach-outline" size={20} color={colors.gold} />
                <Text style={styles.rowLabel}>{d}</Text>
                <Ionicons name="checkmark-circle" size={20} color={colors.green} />
              </Pressable>
            ))}
            <PrimaryButton label="Ajouter un document" variant="outline" onPress={() => {}} />
          </>
        )}

        {section === 'Photos' && (
          <>
            <View style={styles.photoGrid}>
              {[1, 2, 3, 4].map((i) => (
                <View key={i} style={styles.photoTile}><Ionicons name="image-outline" size={20} color={colors.textMuted} /></View>
              ))}
              <Pressable style={[styles.photoTile, styles.photoAdd]}><Ionicons name="add" size={22} color={colors.gold} /></Pressable>
            </View>
          </>
        )}

        {section === 'Pricing' && (
          <>
            <Text style={styles.label}>Prix par jour (€)</Text>
            <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />
            <Text style={styles.hint}>Commission CAR ONE PLUS : 5% prélevés sur ce montant lors du versement.</Text>
            <PrimaryButton label={t('common.save')} onPress={() => navigation.goBack()} />
          </>
        )}

        {section === 'Calendar' && (
          <>
            <Text style={styles.hint}>Bloquez les périodes où votre véhicule n'est pas disponible.</Text>
            <Pressable style={styles.row} onPress={() => setBlocked((p) => [...p, Date.now()])}>
              <Ionicons name="add-circle-outline" size={20} color={colors.gold} />
              <Text style={styles.rowLabel}>Ajouter une période bloquée</Text>
            </Pressable>
            {blocked.map((b) => (
              <View key={b} style={styles.row}>
                <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />
                <Text style={styles.rowLabel}>Période bloquée</Text>
              </View>
            ))}
          </>
        )}

        {section === 'Rules' && (
          <>
            {['Non-fumeur', 'Animaux non admis', 'Âge minimum 21 ans', 'Kilométrage inclus : 200 km/jour'].map((r) => (
              <View key={r} style={styles.row}><Ionicons name="checkmark" size={18} color={colors.gold} /><Text style={styles.rowLabel}>{r}</Text></View>
            ))}
          </>
        )}

        {section === 'AccessMode' && (
          <>
            {[{ id: 'meetup', label: t('vehicle.pickupMeetup') }, { id: 'agency', label: t('vehicle.pickupAgency') }, { id: 'digital_key', label: t('vehicle.pickupDigitalKey') }].map((opt) => (
              <View key={opt.id} style={styles.row}>
                <Text style={styles.rowLabel}>{opt.label}</Text>
                <Ionicons name={opt.id === 'meetup' ? 'radio-button-on' : 'radio-button-off'} size={18} color={opt.id === 'meetup' ? colors.gold : colors.textMuted} />
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  vehicleName: { ...typography.h2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14 },
  rowLabel: { ...typography.body, flex: 1 },
  label: { ...typography.h3, fontSize: 14 },
  input: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, paddingHorizontal: 16, height: 52, color: colors.white },
  hint: { ...typography.caption, lineHeight: 17 },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  photoTile: { width: '30%', aspectRatio: 1, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, alignItems: 'center', justifyContent: 'center' },
  photoAdd: { borderStyle: 'dashed', borderColor: colors.gold },
});
