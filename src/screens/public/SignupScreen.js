import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppState } from '../../context/AppStateContext';

export default function SignupScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { setUser } = useAppState();
  const accountType = route.params?.accountType || 'individual';
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = () => {
    setUser((prev) => ({ ...prev, fullName: fullName || prev.fullName, accountType: accountType === 'professional' ? 'professional' : 'renter' }));
    navigation.navigate('IdentityVerification');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 14 }}>
        <Text style={styles.title}>{t('auth.signup')}</Text>
        <TextInput style={styles.input} placeholder="Nom complet" placeholderTextColor={colors.textMuted} value={fullName} onChangeText={setFullName} />
        <TextInput style={styles.input} placeholder={t('auth.email')} placeholderTextColor={colors.textMuted} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder={t('auth.password')} placeholderTextColor={colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry />
        <PrimaryButton label={t('auth.signup')} onPress={submit} style={{ marginTop: 8 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { ...typography.h1, marginBottom: 8 },
  input: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, paddingHorizontal: 16, height: 52, color: colors.white },
});
