import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii } from '../../theme/colors';
import PrimaryButton from '../../components/PrimaryButton';

const SEVERITIES = [{ id: 'minor', label: 'Léger' }, { id: 'moderate', label: 'Modéré' }, { id: 'major', label: 'Important' }];

export default function AddDamageScreen({ navigation }) {
  const [severity, setSeverity] = useState('minor');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState(0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="close" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>Ajouter un dommage</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={{ padding: 20, gap: 16 }}>
        <Pressable style={styles.photoZone} onPress={() => setPhotos((p) => p + 1)}>
          <Ionicons name="camera-outline" size={28} color={colors.gold} />
          <Text style={styles.photoZoneText}>{photos > 0 ? `${photos} photo(s) ajoutée(s)` : 'Ajouter des photos'}</Text>
        </Pressable>
        <View>
          <Text style={styles.label}>Gravité</Text>
          <View style={styles.chipsRow}>
            {SEVERITIES.map((s) => (
              <Pressable key={s.id} style={[styles.chip, severity === s.id && styles.chipActive]} onPress={() => setSeverity(s.id)}>
                <Text style={[styles.chipText, severity === s.id && styles.chipTextActive]}>{s.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textarea}
            placeholder="Décrivez le dommage constaté..."
            placeholderTextColor={colors.textMuted}
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>
        <PrimaryButton label="Enregistrer le dommage" onPress={() => navigation.goBack()} disabled={photos === 0} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  photoZone: { height: 120, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 8 },
  photoZoneText: { ...typography.bodyMuted },
  label: { ...typography.h3, marginBottom: 8, fontSize: 14 },
  chipsRow: { flexDirection: 'row', gap: 10 },
  chip: { paddingHorizontal: 16, height: 38, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.cardBorder, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  chipActive: { borderColor: colors.gold, backgroundColor: colors.bgElevated },
  chipText: { color: colors.textSecondary, fontWeight: '600', fontSize: 13 },
  chipTextActive: { color: colors.gold },
  textarea: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14, color: colors.white, minHeight: 100, textAlignVertical: 'top' },
});
