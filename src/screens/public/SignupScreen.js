import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppState } from '../../context/AppStateContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { createMyProfile } from '../../lib/api/auth';

// accountType ('individual' | 'professional') vient du choix fait sur
// AccountTypeScreen — il est écrit UNE SEULE FOIS dans profiles.account_type
// et devient définitif (voir lib/api/auth.js, supabase/schema.sql). C'est lui
// qui détermine, dans AppNavigator.js, quelle arborescence de navigation
// (Particulier ou Professionnel) est montée — il n'existe plus de bascule.
export default function SignupScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { setUser, setAuthStatus, setPendingIdentityVerification } = useAppState();
  const accountType = route.params?.accountType === 'professional' ? 'professional' : 'individual';
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!fullName.trim() || !email.trim() || password.length < 6) {
      setError('Nom, e-mail et mot de passe (6 caractères min.) sont requis.');
      return;
    }
    setError('');
    setSubmitting(true);

    // Crée un vrai compte Supabase Auth quand le backend est branché, puis
    // écrit immédiatement account_type dans profiles — c'est cette ligne en
    // base, pas un état écran, qui décide définitivement de l'espace de ce
    // compte (voir lib/api/auth.js, supabase/schema.sql). Sinon reste en
    // mode démo local (voir README, isSupabaseConfigured).
    if (isSupabaseConfigured) {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email: email.trim(), password });
      if (signUpError) {
        setSubmitting(false);
        setError(signUpError.message);
        return;
      }
      const userId = signUpData?.user?.id;
      if (userId) {
        try {
          await createMyProfile({ id: userId, email: email.trim(), accountType, fullName: fullName.trim() });
        } catch (profileError) {
          setSubmitting(false);
          setError(profileError.message || 'Impossible de créer le profil.');
          return;
        }
      }
    }

    setUser((prev) => ({ ...prev, fullName: fullName.trim(), email: email.trim(), accountType }));
    setPendingIdentityVerification(true);
    setSubmitting(false);
    // Bascule immédiatement le switch racine (AppNavigator.js) sur l'espace
    // correspondant à accountType — Particulier ou Professionnel, jamais un
    // choix libre. L'écran KYC/KYB s'affiche comme premier écran de cet espace.
    setAuthStatus('signedIn');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 14 }}>
        <Text style={styles.title}>{t('auth.signup')}</Text>
        <Text style={styles.sub}>{accountType === 'professional' ? t('auth.professional') : t('auth.individual')}</Text>
        <TextInput style={styles.input} placeholder="Nom complet" placeholderTextColor={colors.textMuted} value={fullName} onChangeText={setFullName} />
        <TextInput style={styles.input} placeholder={t('auth.email')} placeholderTextColor={colors.textMuted} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder={t('auth.password')} placeholderTextColor={colors.textMuted} value={password} onChangeText={setPassword} secureTextEntry />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton label={t('auth.signup')} onPress={submit} loading={submitting} style={{ marginTop: 8 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  title: { ...typography.h1, marginBottom: 0 },
  sub: { ...typography.bodyMuted, marginBottom: 8 },
  input: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, paddingHorizontal: 16, height: 52, color: colors.white },
  error: { color: colors.red, fontSize: 13 },
});
