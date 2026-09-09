import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii } from '../theme/colors';

export default function CategoryChip({ icon, label, active, onPress, comingSoon }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Ionicons name={icon} size={22} color={active ? colors.gold : colors.textSecondary} />
      <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>{label}</Text>
      {comingSoon && <Text style={styles.soon}>Bientôt</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    width: 84, paddingVertical: 12, paddingHorizontal: 6, borderRadius: radii.md,
    backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.cardBorder,
    alignItems: 'center', gap: 6,
  },
  chipActive: { borderColor: colors.gold, backgroundColor: colors.bgElevated },
  label: { color: colors.textSecondary, fontSize: 11, fontWeight: '600', textAlign: 'center' },
  labelActive: { color: colors.gold },
  soon: { color: colors.textMuted, fontSize: 9 },
});
