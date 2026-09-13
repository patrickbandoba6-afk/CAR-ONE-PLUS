import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Image, Modal, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import { useAppState } from '../../context/AppStateContext';
import { formatMoney, formatDateTime } from '../../utils/format';
import { LEGAL_ENTITY } from '../../data/legalEntity';
import { KYC_DOCUMENT_LABEL_KEYS } from '../../data/kycRequirements';
import SignaturePad, { SignaturePreview } from '../../components/SignaturePad';
import PrimaryButton from '../../components/PrimaryButton';
import { buildContractHtml, exportContractPdf } from '../../lib/contractPdf';
import { pickImage } from '../../utils/pickImage';

const STATUS_LABEL = {
  pending_renter: 'En attente de signature — locataire',
  pending_owner: 'En attente de signature — propriétaire',
  completed: 'Contrat signé par les deux parties',
};

export default function ContractScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { contracts, signContract, attachContractDocument } = useAppState();
  const contract = contracts.find((c) => c.id === route.params.contractId);
  const docLabel = (key) => t(`kyc.${KYC_DOCUMENT_LABEL_KEYS[key]}`);
  const [exporting, setExporting] = useState(false);
  // Rôle en cours de signature (ouvre le modal ci-dessous) — la signature
  // est tracée à l'instant, sur ce contrat précis, jamais réutilisée
  // silencieusement depuis une signature enregistrée ailleurs.
  const [signingRole, setSigningRole] = useState(null);
  const [draftStrokes, setDraftStrokes] = useState([]);
  const [importingRole, setImportingRole] = useState(null);

  if (!contract) {
    return (
      <SafeAreaView style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={typography.bodyMuted}>Contrat introuvable.</Text>
      </SafeAreaView>
    );
  }

  const openSigning = (role) => { setDraftStrokes([]); setSigningRole(role); };
  const confirmSigning = () => {
    signContract(contract.id, signingRole, draftStrokes);
    setSigningRole(null);
    setDraftStrokes([]);
  };

  const importDocument = async (role) => {
    setImportingRole(role);
    try {
      const uri = await pickImage();
      if (uri) attachContractDocument(contract.id, role, uri);
    } finally {
      setImportingRole(null);
    }
  };

  const exportPdf = async () => {
    setExporting(true);
    try {
      await exportContractPdf(await buildContractHtml(contract));
    } catch (e) {
      Alert.alert('Export impossible', "Le PDF n'a pas pu être généré. Réessayez.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>Contrat de location</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 18 }}>
        <View style={styles.letterhead}>
          <Image source={require('../../assets/logo-car-one-plus.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.legalMention}>{LEGAL_ENTITY.legalMention}</Text>
          <Text style={styles.ref}>Contrat n° {contract.id.toUpperCase()}</Text>
        </View>

        <View style={[styles.statusBadge, contract.status === 'completed' && styles.statusBadgeDone]}>
          <Ionicons name={contract.status === 'completed' ? 'checkmark-circle' : 'time-outline'} size={16} color={contract.status === 'completed' ? colors.green : colors.amber} />
          <Text style={[styles.statusText, contract.status === 'completed' && { color: colors.green }]}>{STATUS_LABEL[contract.status]}</Text>
        </View>

        <View style={styles.card}>
          <SummaryRow label="Locataire" value={contract.renterName} />
          <SummaryRow label="Propriétaire" value={contract.ownerName} />
          <View style={styles.divider} />
          <SummaryRow label="Période" value={`${formatDateTime(contract.startsAt)} → ${formatDateTime(contract.endsAt)}`} />
          <SummaryRow label="Montant" value={formatMoney(contract.totalMinor, contract.currency)} bold />
          {contract.deliveryAddress && <SummaryRow label="Livraison" value={contract.deliveryAddress} />}
        </View>

        <View>
          <Text style={styles.sectionTitle}>Pièces jointes — locataire</Text>
          {contract.renterDocsSnapshot?.map((d) => (
            <View key={d.key} style={styles.docRow}>
              <Ionicons name={d.present ? 'checkmark-circle' : 'alert-circle-outline'} size={16} color={d.present ? colors.green : colors.amber} />
              <Text style={styles.docLabel}>{docLabel(d.key)}</Text>
            </View>
          ))}
        </View>

        {contract.requiredOwnerDocs?.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Documents requis pour ce bien</Text>
            {contract.requiredOwnerDocs.map((doc) => (
              <View key={doc} style={styles.docRow}>
                <Ionicons name="document-attach-outline" size={16} color={colors.gold} />
                <Text style={styles.docLabel}>{doc}</Text>
              </View>
            ))}
            <Text style={styles.hint}>Fournis par le propriétaire lors de la mise en location (Ma flotte).</Text>
          </View>
        )}

        <View style={styles.signaturesRow}>
          <SignatureBlock
            label="Locataire"
            name={contract.renterName}
            signedAt={contract.renterSignedAt}
            signatureData={contract.renterSignature}
            documentUri={contract.renterDocumentUri}
            importing={importingRole === 'renter'}
            onSign={() => openSigning('renter')}
            onImport={() => importDocument('renter')}
          />
          <SignatureBlock
            label="Propriétaire"
            name={contract.ownerName}
            signedAt={contract.ownerSignedAt}
            signatureData={contract.ownerSignature}
            documentUri={contract.ownerDocumentUri}
            importing={importingRole === 'owner'}
            onSign={() => openSigning('owner')}
            onImport={() => importDocument('owner')}
          />
        </View>

        <Text style={styles.pdfHint}>Le PDF ci-dessous reflète l'état actuel du contrat — vous pouvez aussi le télécharger vierge, le signer en dehors de l'application, puis rajouter le document signé ci-dessus.</Text>
        <PrimaryButton label="Télécharger le PDF" variant="outline" onPress={exportPdf} loading={exporting} />
      </ScrollView>

      <Modal visible={signingRole != null} transparent animationType="fade" onRequestClose={() => setSigningRole(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Signature — {signingRole === 'renter' ? 'Locataire' : 'Propriétaire'}</Text>
            <Text style={styles.modalHint}>Signez avec le doigt directement ci-dessous. Cette signature est appliquée immédiatement à ce contrat.</Text>
            <SignaturePad value={draftStrokes} onChange={setDraftStrokes} height={180} />
            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancel} onPress={() => setSigningRole(null)}>
                <Text style={styles.modalCancelText}>Annuler</Text>
              </Pressable>
              <PrimaryButton label="Valider la signature" onPress={confirmSigning} disabled={draftStrokes.length === 0} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function SummaryRow({ label, value, bold }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, bold && { color: colors.gold, fontWeight: '800' }]}>{value}</Text>
    </View>
  );
}

function SignatureBlock({ label, name, signedAt, signatureData, documentUri, importing, onSign, onImport }) {
  return (
    <View style={styles.signatureCard}>
      <Text style={styles.signatureLabel}>{label}</Text>
      <Text style={styles.signatureName}>{name}</Text>
      {signedAt ? (
        <>
          {documentUri ? (
            <Image source={{ uri: documentUri }} style={styles.docPreview} resizeMode="cover" />
          ) : (
            <SignaturePreview value={signatureData} height={56} />
          )}
          <Text style={styles.signedAt}>Signé le {formatDateTime(signedAt)}</Text>
        </>
      ) : (
        <>
          <PrimaryButton label="Signer maintenant" onPress={onSign} style={{ height: 40, marginTop: 8 }} />
          <Pressable style={styles.importBtn} onPress={onImport} disabled={importing}>
            <Ionicons name="cloud-upload-outline" size={14} color={colors.gold} />
            <Text style={styles.importBtnText}>{importing ? 'Import…' : 'Importer un document signé'}</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  letterhead: { alignItems: 'center', gap: 4, paddingVertical: 8 },
  logo: { width: 140, height: 44 },
  legalMention: { ...typography.caption, color: colors.textSecondary },
  ref: { ...typography.caption, marginTop: 6 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'center', backgroundColor: colors.card, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.amber, paddingHorizontal: 14, paddingVertical: 8 },
  statusBadgeDone: { borderColor: colors.green },
  statusText: { ...typography.caption, color: colors.amber, fontWeight: '700' },
  card: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 16, gap: 10 },
  divider: { height: 1, backgroundColor: colors.cardBorder, marginVertical: 2 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { ...typography.bodyMuted },
  summaryValue: { ...typography.body, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
  sectionTitle: { ...typography.h3, fontSize: 14, marginBottom: 8 },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  docLabel: { ...typography.caption, color: colors.textSecondary },
  hint: { ...typography.caption, marginTop: 6, lineHeight: 16 },
  signaturesRow: { flexDirection: 'row', gap: 12 },
  signatureCard: { flex: 1, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14, gap: 4 },
  signatureLabel: { ...typography.caption, fontWeight: '700', color: colors.gold },
  signatureName: { ...typography.body, fontWeight: '700' },
  signedAt: { ...typography.caption, marginTop: 4 },
  docPreview: { width: '100%', height: 56, borderRadius: radii.sm },
  importBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8, paddingVertical: 6 },
  importBtnText: { ...typography.caption, color: colors.gold, fontWeight: '700', textAlign: 'center' },
  pdfHint: { ...typography.caption, lineHeight: 17 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(5,7,12,0.7)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modalCard: { width: '100%', backgroundColor: colors.bgElevated, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.cardBorder, padding: 20, gap: 12 },
  modalTitle: { ...typography.h3 },
  modalHint: { ...typography.caption, lineHeight: 17 },
  modalActions: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  modalCancel: { paddingHorizontal: 14, paddingVertical: 12 },
  modalCancelText: { color: colors.textSecondary, fontWeight: '600' },
});
