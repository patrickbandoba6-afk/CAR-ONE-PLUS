import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import { useAppState } from '../../context/AppStateContext';
import { DEMO_VEHICLES } from '../../data/vehicles';
import { pickImage } from '../../utils/pickImage';
import { formatDate } from '../../utils/format';
import PrimaryButton from '../../components/PrimaryButton';

const STATUS_LABEL = { open: 'Ouvert', in_review: 'En cours', resolved: 'Résolu' };
const STATUS_COLOR = { open: colors.red, in_review: colors.amber, resolved: colors.green };

// Déclaration de sinistre avec photos du constat — le propriétaire choisit le
// bien concerné, décrit ce qui s'est passé, et joint autant de photos que
// nécessaire (constat amiable, dégâts, plaques...) avant d'envoyer.
export default function ClaimsScreen({ navigation }) {
  const { t } = useTranslation();
  const { myListings, claims, addClaim } = useAppState();
  const [showForm, setShowForm] = useState(false);
  const [vehicleId, setVehicleId] = useState(null);
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);

  const myVehicles = [
    ...DEMO_VEHICLES.filter((v) => v.ownerKind !== 'platform_fleet'),
    ...myListings,
  ];

  const addPhoto = async () => {
    const uri = await pickImage();
    if (uri) setPhotos((p) => [...p, uri]);
  };

  const canSubmit = vehicleId && description.trim() && photos.length > 0;
  const submit = () => {
    if (!canSubmit) return;
    const vehicle = myVehicles.find((v) => v.id === vehicleId);
    addClaim({ vehicleId, vehicleLabel: vehicle ? `${vehicle.make} ${vehicle.model}` : vehicleId, description: description.trim(), photos });
    setShowForm(false);
    setVehicleId(null);
    setDescription('');
    setPhotos([]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>{t('owner.claims')}</Text>
        <Pressable onPress={() => setShowForm((v) => !v)}><Ionicons name={showForm ? 'close-circle-outline' : 'add-circle-outline'} size={24} color={colors.gold} /></Pressable>
      </View>

      <FlatList
        data={claims}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={showForm ? (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Déclarer un sinistre</Text>

            <Text style={styles.label}>Bien concerné</Text>
            <View style={styles.vehicleWrap}>
              {myVehicles.slice(0, 8).map((v) => (
                <Pressable key={v.id} style={[styles.vehicleChip, vehicleId === v.id && styles.vehicleChipActive]} onPress={() => setVehicleId(v.id)}>
                  <Text style={[styles.vehicleChipText, vehicleId === v.id && { color: colors.gold }]}>{v.make} {v.model}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.label}>Que s'est-il passé ?</Text>
            <TextInput
              style={styles.textarea}
              placeholder="Décrivez les circonstances du sinistre..."
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <Text style={styles.label}>Photos du constat</Text>
            <View style={styles.photoGrid}>
              {photos.map((uri) => (
                <Image key={uri} source={{ uri }} style={styles.photoTile} />
              ))}
              <Pressable style={styles.photoAdd} onPress={addPhoto}>
                <Ionicons name="camera-outline" size={22} color={colors.gold} />
                <Text style={styles.photoAddText}>Ajouter</Text>
              </Pressable>
            </View>
            <Text style={styles.hint}>Constat amiable, dégâts, plaque d'immatriculation — autant de photos que nécessaire.</Text>

            <PrimaryButton label="Envoyer la déclaration" onPress={submit} disabled={!canSubmit} style={{ marginTop: 8 }} />
          </View>
        ) : null}
        ListEmptyComponent={!showForm ? (
          <View style={styles.empty}>
            <Ionicons name="shield-checkmark-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>Aucun sinistre en cours sur vos véhicules.</Text>
          </View>
        ) : null}
        renderItem={({ item }) => (
          <View style={styles.claimCard}>
            <View style={styles.claimTop}>
              <Text style={styles.claimVehicle}>{item.vehicleLabel}</Text>
              <View style={[styles.statusBadge, { borderColor: STATUS_COLOR[item.status] }]}>
                <Text style={[styles.statusText, { color: STATUS_COLOR[item.status] }]}>{STATUS_LABEL[item.status]}</Text>
              </View>
            </View>
            <Text style={styles.claimDate}>Déclaré le {formatDate(item.createdAt)}</Text>
            <Text style={styles.claimDesc}>{item.description}</Text>
            {item.photos?.length > 0 && (
              <FlatList
                horizontal
                data={item.photos}
                keyExtractor={(uri) => uri}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, marginTop: 10 }}
                renderItem={({ item: uri }) => <Image source={{ uri }} style={styles.claimPhoto} />}
              />
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  empty: { alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 40, paddingTop: 80 },
  emptyText: { ...typography.bodyMuted, textAlign: 'center' },
  form: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 16, gap: 10, marginBottom: 18 },
  formTitle: { ...typography.h3, fontSize: 15 },
  label: { ...typography.caption, fontWeight: '700', color: colors.textSecondary, marginTop: 6 },
  vehicleWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  vehicleChip: { borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radii.pill, paddingHorizontal: 12, paddingVertical: 7 },
  vehicleChipActive: { borderColor: colors.gold, backgroundColor: 'rgba(245,166,35,0.12)' },
  vehicleChipText: { ...typography.caption, color: colors.textSecondary },
  textarea: { backgroundColor: colors.bgElevated, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.cardBorder, padding: 12, minHeight: 70, color: colors.white, textAlignVertical: 'top' },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  photoTile: { width: '30%', aspectRatio: 1, borderRadius: radii.md },
  photoAdd: { width: '30%', aspectRatio: 1, backgroundColor: colors.bgElevated, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 4 },
  photoAddText: { ...typography.caption, fontSize: 11 },
  hint: { ...typography.caption, lineHeight: 16 },
  claimCard: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14 },
  claimTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  claimVehicle: { ...typography.body, fontWeight: '700' },
  claimDate: { ...typography.caption, marginTop: 2 },
  claimDesc: { ...typography.bodyMuted, marginTop: 8, lineHeight: 19 },
  claimPhoto: { width: 72, height: 72, borderRadius: radii.sm },
  statusBadge: { borderWidth: 1, borderRadius: radii.pill, paddingHorizontal: 9, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },
});
