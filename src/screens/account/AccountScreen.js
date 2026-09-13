import React from 'react';
import { View, Text, Pressable, Image, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import { useAppState } from '../../context/AppStateContext';

export default function AccountScreen({ navigation }) {
  const { t } = useTranslation();
  const { user, signOut, loyaltyPoints } = useAppState();

  // Compte "Particulier" = louer uniquement (voir AccountTypeScreen) — la
  // mise en location vit exclusivement côté Professionnel (ProDashboard,
  // Fleet, ProBookings...), donc aucun raccourci propriétaire ici.
  const rows = [
    { label: t('account.profile'), icon: 'person-outline', screen: 'Profile' },
    { label: 'Fidélité', icon: 'trophy-outline', screen: 'Loyalty' },
    { label: t('account.drivers'), icon: 'people-outline', screen: 'Drivers' },
    { label: t('account.documents'), icon: 'folder-outline', screen: 'AccountDocuments' },
    { label: 'Contrats', icon: 'document-lock-outline', screen: 'Contracts' },
    { label: t('account.payments'), icon: 'card-outline', screen: 'Payments' },
    { label: t('account.notifications'), icon: 'notifications-outline', screen: 'Notifications' },
    { label: t('account.privacy'), icon: 'lock-closed-outline', screen: 'Privacy' },
    { label: t('account.security'), icon: 'shield-checkmark-outline', screen: 'Security' },
    { label: t('account.help'), icon: 'help-circle-outline', screen: 'Help' },
    { label: t('account.terms'), icon: 'document-text-outline', screen: 'Terms' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <Pressable style={styles.profileHeader} onPress={() => navigation.navigate('Profile')}>
          {user.avatarUri ? (
            <Image source={{ uri: user.avatarUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarEmpty]}><Ionicons name="person" size={30} color={colors.gold} /></View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user.fullName}</Text>
            <Text style={styles.verified}>{user.identityVerified ? 'Identité vérifiée' : 'Identité non vérifiée'}</Text>
          </View>
          <Pressable style={styles.pointsChip} onPress={() => navigation.navigate('Loyalty')}>
            <Ionicons name="trophy-outline" size={13} color={colors.gold} />
            <Text style={styles.pointsChipText}>{loyaltyPoints} pts</Text>
          </Pressable>
        </Pressable>

        <View style={styles.list}>
          {rows.map((r) => (
            <Pressable key={r.label} style={styles.row} onPress={() => navigation.navigate(r.screen)}>
              <Ionicons name={r.icon} size={20} color={colors.gold} />
              <Text style={styles.rowLabel}>{r.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>

        <Pressable
          style={styles.logout}
          onPress={() => {
            // signOut() invalide la session (si Supabase configuré) et
            // réinitialise l'état local — le switch racine (AppNavigator.js)
            // bascule automatiquement sur l'espace Auth, aucun navigate()
            // manuel n'est nécessaire ni possible vers un espace protégé.
            signOut();
          }}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.red} />
          <Text style={styles.logoutText}>{t('account.logout')}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  avatarEmpty: { backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.cardBorder },
  name: { ...typography.h2 },
  verified: { ...typography.caption, marginTop: 2 },
  pointsChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.card, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.gold, paddingHorizontal: 10, paddingVertical: 6 },
  pointsChipText: { ...typography.caption, color: colors.gold, fontWeight: '700' },
  list: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  rowLabel: { ...typography.body, flex: 1 },
  logout: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', paddingVertical: 12 },
  logoutText: { color: colors.red, fontWeight: '700' },
});
