import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import PrimaryButton from '../../components/PrimaryButton';

export default function LoginScreen({ navigation }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 24, gap: 14, flex: 1, justifyContent: 'center' }}>
        <Text style={styles.title}>{t('auth.login')}</Text>
        <TextInput style={styles.input} placeholder={t('auth.email')} placeholderTextColor={colors.textMuted} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder={t('auth.password')} placeholderTextColor={colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry />
        <Text style={styles.forgot}>{t('auth.forgotPassword')}</Text>
        <PrimaryButton label={t('auth.login')} onPress={() => navigation.replace('MainTabs')} />
        <Text onPress={() => navigation.navigate('AccountType')} style={styles.switch}>
          {t('auth.noAccount')} {t('auth.signup')}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { ...typography.h1, marginBottom: 8 },
  input: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, paddingHorizontal: 16, height: 52, color: colors.white },
  forgot: { color: colors.gold, textAlign: 'right', fontWeight: '600' },
  switch: { color: colors.textSecondary, textAlign: 'center', marginTop: 16 },
});
