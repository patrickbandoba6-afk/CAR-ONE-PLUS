import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import { useAppState } from '../../context/AppStateContext';

export default function AccountScreen({ navigation }) {
  const { t } = useTranslation();
  const { user, mode, setMode } = useAppState();

  const rows = [
    { label: t('account.profile'), icon: 'person-outline', screen: 'Profile' },
    { label: t('account.drivers'), icon: 'people-outline', screen: 'Drivers' },
    { label: t('account.documents'), icon: 'folder-outline', screen: 'AccountDocuments' },
    { label: t('account.payments'), icon: 'card-outline', screen: 'Payments' },
    { label: t('account.notifications'), icon: 'notifications-outline', screen: 'Notifications' },
    { label: t('account.privacy'), icon: 'lock-closed-outline', screen: 'Privacy' },
    { label: t('account.security'), icon: 'shield-checkmark-outline', screen: 'Security' },
    { label: t('account.help'), icon: 'help-circle-outline', screen: 'Help' },
    { label: t('account.terms'), icon: 'document-text-outline', screen: 'Terms' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}><Ionicons name="person" size={30} color={colors.gold} /></View>
          <View>
            <Text style={styles.name}>{user.fullName}</Text>
            <Text style={styles.verified}>{user.identityVerified ? 'Identité vérifiée' : 'Identité non vérifiée'}</Text>
          </View>
        </View>

        <Pressable
          style={styles.switchModeCard}
          onPress={() => {
            const next = mode === 'renter' ? 'owner' : 'renter';
            setMode(next);
            navigation.navigate(next === 'owner' ? 'OwnerTab' : 'HomeTab');
          }}
        >
          <Ionicons name="swap-horizontal-outline" size={20} color={colors.gold} />
          <Text style={styles.switchModeText}>{mode === 'renter' ? t('account.switchToOwner') : t('account.switchToRenter')}</Text>
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

        <Pressable style={styles.logout}>
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
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  name: { ...typography.h2 },
  verified: { ...typography.caption, marginTop: 2 },
  switchModeCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.gold, padding: 14 },
  switchModeText: { ...typography.body, fontWeight: '700', color: colors.gold },
  list: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  rowLabel: { ...typography.body, flex: 1 },
  logout: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', paddingVertical: 12 },
  logoutText: { color: colors.red, fontWeight: '700' },
});
