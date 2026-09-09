import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../theme/colors';

// Écran "à venir" — conserve l'arborescence complète des 90 écrans du dossier
// (professionnel / back-office / premium = phases 3 à 5 de la roadmap) sans
// prétendre livrer une fonctionnalité non construite.
export default function ScreenStub({ route }) {
  const { t } = useTranslation();
  const { title, icon = 'construct-outline', phase } = route?.params || {};
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.iconWrap}><Ionicons name={icon} size={34} color={colors.gold} /></View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{t('common.comingSoonBody')}</Text>
        {phase ? <Text style={styles.phase}>{phase}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  iconWrap: { width: 68, height: 68, borderRadius: radii.lg, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  title: { ...typography.h2, textAlign: 'center' },
  body: { ...typography.bodyMuted, textAlign: 'center' },
  phase: { ...typography.caption, color: colors.gold, marginTop: 8, fontWeight: '700' },
});
