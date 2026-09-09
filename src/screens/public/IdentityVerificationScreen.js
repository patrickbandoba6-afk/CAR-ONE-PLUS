import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppState } from '../../context/AppStateContext';

const STEPS = [
  { key: 'id', icon: 'card-outline', labelKey: 'identity.uploadId' },
  { key: 'licence', icon: 'document-text-outline', labelKey: 'identity.uploadLicence' },
  { key: 'selfie', icon: 'camera-outline', labelKey: 'identity.selfie' },
];

export default function IdentityVerificationScreen({ navigation }) {
  const { t } = useTranslation();
  const { setUser } = useAppState();
  const [done, setDone] = useState({});

  const toggle = (key) => setDone((prev) => ({ ...prev, [key]: !prev[key] }));
  const allDone = STEPS.every((s) => done[s.key]);

  const submit = () => {
    setUser((prev) => ({ ...prev, identityVerified: true, licenceVerified: true }));
    navigation.replace('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 24, flex: 1 }}>
        <Text style={styles.title}>{t('identity.title')}</Text>
        <Text style={styles.body}>{t('identity.body')}</Text>
        <View style={{ gap: 12, marginTop: 24 }}>
          {STEPS.map((s) => (
            <Pressable key={s.key} style={[styles.row, done[s.key] && styles.rowDone]} onPress={() => toggle(s.key)}>
              <Ionicons name={s.icon} size={22} color={done[s.key] ? colors.green : colors.gold} />
              <Text style={styles.rowLabel}>{t(s.labelKey)}</Text>
              <Ionicons name={done[s.key] ? 'checkmark-circle' : 'chevron-forward'} size={20} color={done[s.key] ? colors.green : colors.textMuted} />
            </Pressable>
          ))}
        </View>
        <Text style={styles.hint}>Ces documents restent confidentiels et servent uniquement à la vérification (identité, permis, lutte anti-fraude).</Text>
        <View style={{ flex: 1 }} />
        <PrimaryButton label={t('identity.submit')} onPress={submit} disabled={!allDone} />
        <Pressable onPress={() => navigation.replace('MainTabs')}>
          <Text style={styles.skip}>Plus tard</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { ...typography.h1, marginBottom: 8 },
  body: { ...typography.bodyMuted },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 16 },
  rowDone: { borderColor: colors.green },
  rowLabel: { ...typography.body, flex: 1 },
  hint: { ...typography.caption, marginTop: 16, lineHeight: 18 },
  skip: { color: colors.textSecondary, textAlign: 'center', marginTop: 12 },
});
