import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii, shadow } from '../../theme/colors';

export default function AccountTypeScreen({ navigation }) {
  const { t } = useTranslation();

  const choose = (accountType) => navigation.navigate('Signup', { accountType });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('auth.choiceTitle')}</Text>
      <Pressable style={[styles.card, shadow]} onPress={() => choose('individual')}>
        <Ionicons name="person-outline" size={30} color={colors.gold} />
        <Text style={styles.cardTitle}>{t('auth.individual')}</Text>
        <Text style={styles.cardBody}>{t('auth.individualDesc')}</Text>
      </Pressable>
      <Pressable style={[styles.card, shadow]} onPress={() => choose('professional')}>
        <Ionicons name="business-outline" size={30} color={colors.gold} />
        <Text style={styles.cardTitle}>{t('auth.professional')}</Text>
        <Text style={styles.cardBody}>{t('auth.professionalDesc')}</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
        <Text style={styles.loginLinkText}>{t('auth.haveAccount')} {t('auth.login')}</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 24, gap: 16, justifyContent: 'center' },
  title: { ...typography.h1, marginBottom: 12 },
  card: { backgroundColor: colors.card, borderRadius: radii.lg, padding: 20, gap: 8, borderWidth: 1, borderColor: colors.cardBorder },
  cardTitle: { ...typography.h2 },
  cardBody: { ...typography.bodyMuted },
  loginLink: { alignItems: 'center', marginTop: 24 },
  loginLinkText: { color: colors.gold, fontWeight: '700' },
});
