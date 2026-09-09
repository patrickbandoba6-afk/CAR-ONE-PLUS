import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, radii, typography } from '../theme/colors';

export default function PrimaryButton({ label, onPress, variant = 'gold', disabled, loading, style }) {
  const isGold = variant === 'gold';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isGold ? styles.gold : styles.outline,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isGold ? colors.bg : colors.gold} />
      ) : (
        <Text style={isGold ? styles.goldLabel : styles.outlineLabel}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  gold: { backgroundColor: colors.gold },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.gold },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85 },
  goldLabel: { ...typography.button, color: colors.bg },
  outlineLabel: { ...typography.button, color: colors.gold },
});
