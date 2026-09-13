import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii } from '../../theme/colors';
import { useAppState } from '../../context/AppStateContext';
import { formatMoney, formatDate } from '../../utils/format';
import { CONTRACT_TEMPLATES } from '../../data/contractTemplates';
import { buildTemplateHtml, exportContractPdf } from '../../lib/contractPdf';

const STATUS_COLOR = { pending_renter: colors.amber, pending_owner: colors.amber, completed: colors.green };
const STATUS_LABEL = { pending_renter: 'Signature locataire', pending_owner: 'Signature propriétaire', completed: 'Complet' };

// Historique de tous les contrats générés (voir PaymentScreen.js) — chaque
// contrat garde les pièces du locataire et la liste des documents requis pour
// le bien loué, avec le statut de signature des deux parties. Le menu de
// modèles en haut permet de consulter/exporter un contrat type avant même
// d'avoir réservé (assurance, contrat pro, conducteur additionnel...).
export default function ContractsListScreen({ navigation }) {
  const { contracts } = useAppState();
  const [generatingId, setGeneratingId] = useState(null);

  const generateTemplate = async (template) => {
    setGeneratingId(template.id);
    try {
      await exportContractPdf(await buildTemplateHtml(template));
    } catch (e) {
      Alert.alert('Export impossible', "Le PDF n'a pas pu être généré. Réessayez.");
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>Contrats</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={contracts}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={
          <View style={{ marginBottom: 20, gap: 12 }}>
            <Text style={styles.sectionTitle}>Modèles de documents</Text>
            {CONTRACT_TEMPLATES.map((tpl) => (
              <View key={tpl.id} style={styles.templateCard}>
                <View style={styles.templateIcon}><Ionicons name={tpl.icon} size={20} color={colors.gold} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.templateTitle}>{tpl.title}</Text>
                  <Text style={styles.templateBody} numberOfLines={2}>{tpl.body}</Text>
                </View>
                <Pressable style={styles.templateBtn} onPress={() => generateTemplate(tpl)} disabled={generatingId === tpl.id}>
                  <Ionicons name={generatingId === tpl.id ? 'hourglass-outline' : 'document-outline'} size={16} color={colors.gold} />
                </Pressable>
              </View>
            ))}
            <Text style={styles.sectionTitle}>Historique</Text>
          </View>
        }
        ListEmptyComponent={<Text style={styles.empty}>Aucun contrat pour l'instant — un contrat est généré automatiquement à chaque réservation payée.</Text>}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => navigation.navigate('Contract', { contractId: item.id })}>
            <View style={{ flex: 1 }}>
              <Text style={styles.parties}>{item.renterName} ↔ {item.ownerName}</Text>
              <Text style={styles.dates}>{formatDate(item.startsAt)} → {formatDate(item.endsAt)}</Text>
              <Text style={styles.total}>{formatMoney(item.totalMinor, item.currency)}</Text>
            </View>
            <View style={[styles.statusBadge, { borderColor: STATUS_COLOR[item.status] }]}>
              <Text style={[styles.statusText, { color: STATUS_COLOR[item.status] }]}>{STATUS_LABEL[item.status]}</Text>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  empty: { ...typography.bodyMuted, textAlign: 'center', marginTop: 60, lineHeight: 20 },
  sectionTitle: { ...typography.h3, fontSize: 14, color: colors.gold, marginBottom: 2 },
  templateCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14 },
  templateIcon: { width: 38, height: 38, borderRadius: radii.sm, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' },
  templateTitle: { ...typography.body, fontWeight: '700' },
  templateBody: { ...typography.caption, marginTop: 2, lineHeight: 15 },
  templateBtn: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: colors.cardBorder, alignItems: 'center', justifyContent: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 16, gap: 10 },
  parties: { ...typography.body, fontWeight: '700' },
  dates: { ...typography.caption, marginTop: 4 },
  total: { color: colors.gold, fontWeight: '700', marginTop: 6 },
  statusBadge: { borderWidth: 1, borderRadius: radii.pill, paddingHorizontal: 10, paddingVertical: 5 },
  statusText: { fontSize: 11, fontWeight: '700' },
});
