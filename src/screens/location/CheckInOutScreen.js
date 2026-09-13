import React, { useState } from 'react';
import { View, Text, Pressable, Image, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import PrimaryButton from '../../components/PrimaryButton';
import { pickImage } from '../../utils/pickImage';
import { useAppState } from '../../context/AppStateContext';

const CHECKLIST = [
  { key: 'exterior', icon: 'car-outline', label: '4 côtés du véhicule' },
  { key: 'wheels', icon: 'ellipse-outline', label: 'Roues / pneus' },
  { key: 'interior', icon: 'aperture-outline', label: 'Intérieur' },
  { key: 'dashboard', icon: 'speedometer-outline', label: 'Compteur kilométrique' },
  { key: 'fuel', icon: 'flash-outline', label: 'Carburant / batterie' },
];

// Sert au check-in (départ) et au check-out (retour) — 03_SPEC_FONCTIONNELLE.md :
// les deux phases partagent le même parcours guidé (entité Inspection, champ
// phase). Chaque zone exige une vraie photo (pas une simple case cochée) ;
// une fois les 5 prises, le locataire valide et ça part dans l'historique des
// états des lieux (voir AppStateContext.addInspection).
export default function CheckInOutScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { addInspection } = useAppState();
  const phase = route.name === 'CheckOut' ? 'check_out' : 'check_in';
  const [photos, setPhotos] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const capture = async (key) => {
    const uri = await pickImage();
    if (uri) setPhotos((prev) => ({ ...prev, [key]: uri }));
  };

  const allDone = CHECKLIST.every((c) => photos[c.key]);

  const submit = () => {
    setSubmitting(true);
    addInspection({
      bookingId: route.params?.bookingId || null,
      phase,
      photos: CHECKLIST.map((c) => ({ key: c.key, label: c.label, uri: photos[c.key] })),
    });
    setSubmitting(false);
    navigation.navigate(phase === 'check_in' ? 'ActiveRental' : 'Invoice', route.params);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>{phase === 'check_in' ? t('booking.checkIn') : t('booking.checkOut')}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
        <Text style={styles.hint}>Photographiez chaque zone. Les photos sont horodatées et géolocalisées pour votre protection.</Text>
        {CHECKLIST.map((c) => {
          const uri = photos[c.key];
          return (
            <Pressable key={c.key} style={[styles.row, uri && styles.rowDone]} onPress={() => capture(c.key)}>
              {uri ? (
                <Image source={{ uri }} style={styles.thumb} />
              ) : (
                <View style={[styles.thumb, styles.thumbEmpty]}><Ionicons name={c.icon} size={18} color={colors.gold} /></View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.rowLabel}>{c.label}</Text>
                <Text style={styles.rowStatus}>{uri ? 'Photo prise' : 'À photographier'}</Text>
              </View>
              <Ionicons name={uri ? 'checkmark-circle' : 'camera-outline'} size={22} color={uri ? colors.green : colors.textMuted} />
            </Pressable>
          );
        })}
        <Pressable style={styles.damageLink} onPress={() => navigation.navigate('AddDamage', route.params)}>
          <Ionicons name="alert-circle-outline" size={18} color={colors.red} />
          <Text style={styles.damageLinkText}>Signaler un dommage existant</Text>
        </Pressable>
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerHint}>{Object.keys(photos).length} / {CHECKLIST.length} photos prises</Text>
        <PrimaryButton
          label={phase === 'check_in' ? 'Valider et démarrer la location' : 'Valider et clôturer'}
          disabled={!allDone}
          loading={submitting}
          onPress={submit}
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
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 12 },
  rowDone: { borderColor: colors.green },
  thumb: { width: 44, height: 44, borderRadius: radii.sm },
  thumbEmpty: { backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { ...typography.body },
  rowStatus: { ...typography.caption, marginTop: 2 },
  damageLink: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  damageLinkText: { color: colors.red, fontWeight: '700' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.cardBorder, gap: 10 },
  footerHint: { ...typography.caption, textAlign: 'center' },
});
