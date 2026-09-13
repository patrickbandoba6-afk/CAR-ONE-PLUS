import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii } from '../../theme/colors';
import { useAppState } from '../../context/AppStateContext';

// Rôles alignés sur organization_members (supabase/schema.sql) — un
// collaborateur n'a accès qu'à ce que son rôle autorise.
const ROLES = [
  { id: 'owner_admin', label: 'Administrateur' },
  { id: 'fleet_manager', label: 'Gestionnaire flotte' },
  { id: 'agent', label: 'Agent' },
  { id: 'accounting', label: 'Comptabilité' },
  { id: 'support', label: 'Support' },
  { id: 'read_only', label: 'Lecture seule' },
];
const ROLE_LABEL = Object.fromEntries(ROLES.map((r) => [r.id, r.label]));

export default function CollaboratorsScreen({ navigation }) {
  const { collaborators, addCollaborator, removeCollaborator } = useAppState();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('fleet_manager');

  const canInvite = name.trim() && email.trim();
  const invite = () => {
    if (!canInvite) return;
    addCollaborator({ name: name.trim(), email: email.trim(), role });
    setName('');
    setEmail('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>Collaborateurs</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={collaborators}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListEmptyComponent={<Text style={styles.empty}>Aucun collaborateur pour l'instant — vous êtes seul sur ce compte.</Text>}
        ListHeaderComponent={
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Inviter un collaborateur</Text>
            <TextInput style={styles.input} placeholder="Nom complet" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor={colors.textMuted} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            <View style={styles.roleWrap}>
              {ROLES.map((r) => (
                <Pressable key={r.id} style={[styles.roleChip, role === r.id && styles.roleChipActive]} onPress={() => setRole(r.id)}>
                  <Text style={[styles.roleChipText, role === r.id && styles.roleChipTextActive]}>{r.label}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable style={[styles.inviteBtn, !canInvite && styles.inviteBtnDisabled]} onPress={invite}>
              <Text style={styles.inviteBtnText}>Envoyer l'invitation</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.avatar}><Ionicons name="person" size={18} color={colors.gold} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
            <View style={styles.roleBadge}><Text style={styles.roleBadgeText}>{ROLE_LABEL[item.role]}</Text></View>
            <Pressable onPress={() => removeCollaborator(item.id)} hitSlop={8}>
              <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  empty: { ...typography.bodyMuted, textAlign: 'center', marginTop: 20 },
  formCard: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 16, gap: 10, marginBottom: 8 },
  formTitle: { ...typography.h3, fontSize: 14 },
  input: { backgroundColor: colors.bgElevated, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.cardBorder, paddingHorizontal: 14, height: 44, color: colors.white },
  roleWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  roleChip: { borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radii.pill, paddingHorizontal: 12, paddingVertical: 7 },
  roleChipActive: { borderColor: colors.gold, backgroundColor: 'rgba(245,166,35,0.12)' },
  roleChipText: { ...typography.caption, color: colors.textSecondary },
  roleChipTextActive: { color: colors.gold, fontWeight: '700' },
  inviteBtn: { height: 42, borderRadius: radii.pill, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  inviteBtnDisabled: { opacity: 0.4 },
  inviteBtnText: { color: colors.bg, fontWeight: '800' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' },
  name: { ...typography.body, fontWeight: '700' },
  email: { ...typography.caption, marginTop: 2 },
  roleBadge: { backgroundColor: colors.bgElevated, borderRadius: radii.sm, paddingHorizontal: 8, paddingVertical: 4 },
  roleBadgeText: { ...typography.caption, color: colors.gold, fontWeight: '700', fontSize: 11 },
});
