import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, typography } from '../theme/colors';

export default function SectionHeader({ title, actionLabel, onAction }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onAction}><Text style={styles.action}>{actionLabel}</Text></Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { ...typography.h2 },
  action: { color: colors.gold, fontWeight: '700', fontSize: 13 },
});
