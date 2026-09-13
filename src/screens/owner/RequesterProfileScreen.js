import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii } from '../../theme/colors';
import { DEMO_REQUESTERS } from '../../data/demoRequesters';
import { useAppState } from '../../context/AppStateContext';

const STATUS_ICON = { verified: 'checkmark-circle', pending: 'time-outline', missing: 'close-circle-outline' };
const STATUS_COLOR = { verified: colors.green, pending: colors.amber, missing: colors.red };
const STATUS_LABEL = { verified: 'Fourni et vérifié', pending: 'En cours de vérification', missing: 'Manquant' };

// Fiche du demandeur — permet au propriétaire/professionnel de consulter
// l'identité et les pièces fournies (permis, CI, justificatif de domicile,
// attestation fiscale) avant de choisir à qui accorder son bien. Les
// documents sont représentés par leur statut, pas par de fausses pièces
// scannées.
export default function RequesterProfileScreen({ navigation, route }) {
  const { bookingRequests, respondToBookingRequest } = useAppState();
  const request = bookingRequests.find((r) => r.id === route.params?.requestId);
  const profile = DEMO_REQUESTERS[route.params?.requesterId] || DEMO_REQUESTERS[request?.requesterId];

  if (!profile) {
    return (
      <SafeAreaView style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={typography.bodyMuted}>Profil introuvable.</Text>
      </SafeAreaView>
    );
  }

  const respond = (status) => {
    if (request) respondToBookingRequest(request.id, status);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>Profil du demandeur</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 18 }}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}><Ionicons name="person" size={30} color={colors.gold} /></View>
          <Text style={styles.name}>{profile.fullName}</Text>
          <Text style={styles.meta}>{profile.age} ans · Membre depuis {profile.memberSince}</Text>
          <View style={styles.badgesRow}>
            {profile.identityVerified && (
              <View style={styles.badge}><Ionicons name="shield-checkmark" size={13} color={colors.green} /><Text style={styles.badgeText}>Identité vérifiée</Text></View>
            )}
            {profile.licenceVerified && (
              <View style={styles.badge}><Ionicons name="card" size={13} color={colors.green} /><Text style={styles.badgeText}>Permis vérifié</Text></View>
            )}
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatCard label="Locations passées" value={String(profile.tripsCount)} />
          <StatCard label="Note en tant que locataire" value={profile.ratingAsRenter ? `★ ${profile.ratingAsRenter}` : 'Nouveau'} />
        </View>

        <View>
          <Text style={styles.sectionTitle}>Documents fournis</Text>
          <View style={{ gap: 8 }}>
            {profile.documents.map((doc) => (
              <View key={doc.key} style={styles.docRow}>
                <Ionicons name={STATUS_ICON[doc.status]} size={20} color={STATUS_COLOR[doc.status]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.docLabel}>{doc.label}</Text>
                  <Text style={[styles.docStatus, { color: STATUS_COLOR[doc.status] }]}>{STATUS_LABEL[doc.status]}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {request && (
          <View style={styles.requestCard}>
            <Text style={styles.sectionTitle}>Demande en cours</Text>
            <Text style={styles.requestBody}>Souhaite réserver du {new Date(request.startsAt).toLocaleDateString('fr-FR')} au {new Date(request.endsAt).toLocaleDateString('fr-FR')}.</Text>
          </View>
        )}
      </ScrollView>

      {request?.status === 'pending' && (
        <View style={styles.footer}>
          <Pressable style={[styles.footerBtn, styles.decline]} onPress={() => respond('declined')}>
            <Text style={styles.declineText}>Refuser</Text>
          </Pressable>
          <Pressable style={[styles.footerBtn, styles.accept]} onPress={() => respond('accepted')}>
            <Text style={styles.acceptText}>Accepter</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

function StatCard({ label, value }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  profileCard: { alignItems: 'center', gap: 6, backgroundColor: colors.card, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.cardBorder, padding: 20 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  name: { ...typography.h2, fontSize: 19 },
  meta: { ...typography.caption },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8, justifyContent: 'center' },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.bgElevated, borderRadius: radii.pill, paddingHorizontal: 10, paddingVertical: 5 },
  badgeText: { ...typography.caption, fontSize: 11, color: colors.textSecondary },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14, alignItems: 'center', gap: 4 },
  statValue: { ...typography.h2, fontSize: 18 },
  statLabel: { ...typography.caption, textAlign: 'center' },
  sectionTitle: { ...typography.h3, fontSize: 14, marginBottom: 10 },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14 },
  docLabel: { ...typography.body, fontWeight: '600' },
  docStatus: { ...typography.caption, marginTop: 2 },
  requestCard: { backgroundColor: colors.bgElevated, borderRadius: radii.md, padding: 16 },
  requestBody: { ...typography.bodyMuted },
  footer: { flexDirection: 'row', gap: 10, padding: 20, borderTopWidth: 1, borderTopColor: colors.cardBorder },
  footerBtn: { flex: 1, height: 46, borderRadius: radii.pill, alignItems: 'center', justifyContent: 'center' },
  decline: { borderWidth: 1, borderColor: colors.cardBorder },
  declineText: { color: colors.textSecondary, fontWeight: '700' },
  accept: { backgroundColor: colors.gold },
  acceptText: { color: colors.bg, fontWeight: '800' },
});
