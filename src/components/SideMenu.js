import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Image, Modal, Animated, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../theme/colors';
import { useAppState } from '../context/AppStateContext';

const PANEL_WIDTH = 290;

export default function SideMenu({ visible, onClose, navigation }) {
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAppState();
  const isProfessional = user.accountType === 'professional';
  const translateX = useRef(new Animated.Value(-PANEL_WIDTH)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : -PANEL_WIDTH,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const go = (screen) => {
    onClose();
    navigation.navigate(screen);
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr');
  };

  // Deux comptes strictement dissociés : "Particulier" ne sert qu'à louer
  // (voir AccountTypeScreen — "Je veux louer un véhicule"), toute capacité
  // de mise en location (véhicule, yacht, avion...) vit exclusivement côté
  // "Professionnel", y compris pour quelqu'un qui loue son propre bien à
  // titre individuel. Pas de bascule ni de lien entre les deux : il faut se
  // réinscrire sous l'autre profil pour changer de rôle.
  const individualLinks = [
    { icon: 'help-circle-outline', label: t('account.help'), screen: 'Help' },
    { icon: 'shield-checkmark-outline', label: t('account.security'), screen: 'Security' },
    { icon: 'document-text-outline', label: t('account.terms'), screen: 'Terms' },
  ];

  const professionalLinks = [
    { icon: 'grid-outline', label: 'Tableau de bord', screen: 'ProDashboard' },
    { icon: 'car-sport-outline', label: 'Ma flotte', screen: 'Fleet' },
    { icon: 'calendar-outline', label: 'Réservations', screen: 'ProBookings' },
    { icon: 'camera-outline', label: 'États des lieux', screen: 'Inspections' },
    { icon: 'document-text-outline', label: 'Contrats', screen: 'Contracts' },
    { icon: 'people-outline', label: 'Collaborateurs', screen: 'Collaborators' },
    { icon: 'calculator-outline', label: 'Comptabilité', screen: 'Accounting' },
    { icon: 'bar-chart-outline', label: 'Reporting', screen: 'Reporting' },
    { icon: 'headset-outline', label: 'Support professionnel', screen: 'Help' },
    { icon: 'document-text-outline', label: t('account.terms'), screen: 'Terms' },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View style={[styles.panel, { transform: [{ translateX }] }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {isProfessional ? (
              <View style={styles.companyRow}>
                <View style={styles.companyAvatar}><Ionicons name="business" size={24} color={colors.gold} /></View>
                <View style={{ flex: 1 }}>
                  <View style={styles.companyNameRow}>
                    <Text style={styles.name} numberOfLines={1}>{user.company?.name || 'Mon entreprise'}</Text>
                    <View style={styles.proTag}><Text style={styles.proTagText}>PRO</Text></View>
                  </View>
                  <Text style={styles.verified}>{user.company?.verified ? 'Entreprise vérifiée' : 'Vérification en attente'}</Text>
                </View>
                <Pressable onPress={onClose} hitSlop={8}><Ionicons name="close" size={22} color={colors.textSecondary} /></Pressable>
              </View>
            ) : (
              <View style={styles.profileRow}>
                <Pressable style={styles.profileRowMain} onPress={() => go('Profile')}>
                  {user.avatarUri ? (
                    <Image source={{ uri: user.avatarUri }} style={styles.avatar} />
                  ) : (
                    <View style={[styles.avatar, styles.avatarEmpty]}><Ionicons name="person" size={26} color={colors.gold} /></View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name} numberOfLines={1}>{user.fullName}</Text>
                    <Text style={styles.verified}>{user.identityVerified ? 'Identité vérifiée' : 'Identité non vérifiée'}</Text>
                  </View>
                </Pressable>
                <Pressable onPress={onClose} hitSlop={8}><Ionicons name="close" size={22} color={colors.textSecondary} /></Pressable>
              </View>
            )}

            <View style={styles.list}>
              {(isProfessional ? professionalLinks : individualLinks).map((l) => (
                <Pressable key={l.screen} style={styles.row} onPress={() => go(l.screen)}>
                  <Ionicons name={l.icon} size={19} color={colors.gold} />
                  <Text style={styles.rowLabel}>{l.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </Pressable>
              ))}
            </View>

            <Pressable style={styles.langRow} onPress={toggleLanguage}>
              <Ionicons name="globe-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.langText}>Langue</Text>
              <Text style={styles.langValue}>{i18n.language === 'fr' ? 'Français' : 'English'}</Text>
            </Pressable>

            <Pressable style={styles.logout} onPress={() => { onClose(); signOut(); }}>
              <Ionicons name="log-out-outline" size={18} color={colors.red} />
              <Text style={styles.logoutText}>{t('account.logout')}</Text>
            </Pressable>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row' },
  backdrop: { flex: 1, backgroundColor: 'rgba(5,7,12,0.6)' },
  panel: { position: 'absolute', top: 0, bottom: 0, left: 0, width: PANEL_WIDTH, backgroundColor: colors.bgElevated, borderRightWidth: 1, borderRightColor: colors.cardBorder },
  content: { padding: 20, paddingTop: 56, gap: 18 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  profileRowMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  avatarEmpty: { backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  companyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  companyAvatar: { width: 48, height: 48, borderRadius: radii.md, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  companyNameRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  proTag: { backgroundColor: colors.gold, borderRadius: radii.sm, paddingHorizontal: 6, paddingVertical: 1 },
  proTagText: { color: colors.bg, fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  name: { ...typography.h3, flexShrink: 1 },
  verified: { ...typography.caption, marginTop: 2 },
  list: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  rowLabel: { ...typography.body, flex: 1, fontSize: 14 },
  langRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  langText: { ...typography.bodyMuted, flex: 1 },
  langValue: { ...typography.caption, color: colors.gold, fontWeight: '700' },
  logout: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', paddingVertical: 10, marginTop: 4 },
  logoutText: { color: colors.red, fontWeight: '700' },
});
