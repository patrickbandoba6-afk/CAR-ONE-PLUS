import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Switch, Image, Linking, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import { useAppState } from '../../context/AppStateContext';
import { pickImage } from '../../utils/pickImage';
import { KYC_DOCUMENTS, KYC_DOCUMENT_LABEL_KEYS } from '../../data/kycRequirements';

// Écran générique pour les pages Compte (Conducteurs, Documents, Paiements,
// Notifications, Confidentialité, Sécurité, Aide, Conditions), paramétré par
// route.name. Chaque section est réellement fonctionnelle (pas de bouton mort) :
// stockage dans AppStateContext, vrai sélecteur d'image pour les documents,
// vrais liens mailto pour le support, texte réel des chartes.
const HEADERS = {
  Drivers: { title: 'Conducteurs', icon: 'people-outline' },
  AccountDocuments: { title: 'Documents', icon: 'folder-outline' },
  Payments: { title: 'Paiements', icon: 'card-outline' },
  Notifications: { title: 'Notifications', icon: 'notifications-outline' },
  Privacy: { title: 'Confidentialité', icon: 'lock-closed-outline' },
  Security: { title: 'Sécurité', icon: 'shield-checkmark-outline' },
  Help: { title: 'Aide', icon: 'help-circle-outline' },
  Terms: { title: 'Conditions', icon: 'document-text-outline' },
};


export default function AccountInfoScreen({ navigation, route }) {
  const header = HEADERS[route.name];
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>{header.title}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
        {route.name === 'Drivers' && <DriversSection />}
        {route.name === 'AccountDocuments' && <DocumentsSection />}
        {route.name === 'Payments' && <PaymentsSection />}
        {route.name === 'Notifications' && <NotificationsSection />}
        {route.name === 'Privacy' && <PrivacySection navigation={navigation} />}
        {route.name === 'Security' && <SecuritySection />}
        {route.name === 'Help' && <HelpSection />}
        {route.name === 'Terms' && <TermsSection />}
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ icon, label, right, onPress, danger }) {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper style={styles.row} onPress={onPress}>
      <Ionicons name={icon} size={19} color={danger ? colors.red : colors.gold} />
      <Text style={[styles.rowLabel, danger && { color: colors.red }]}>{label}</Text>
      {right}
    </Wrapper>
  );
}

// ---- Conducteurs -----------------------------------------------------
function DriversSection() {
  const { user, drivers, addDriver, removeDriver } = useAppState();
  const [name, setName] = useState('');
  const [licence, setLicence] = useState('');

  const submit = () => {
    if (!name.trim() || !licence.trim()) return;
    addDriver({ name: name.trim(), licence: licence.trim() });
    setName('');
    setLicence('');
  };

  return (
    <>
      <Row icon="person" label={`${user.fullName} (titulaire du compte)`} right={<Ionicons name="checkmark-circle" size={20} color={colors.green} />} />
      {drivers.map((d) => (
        <Row
          key={d.id}
          icon="person-outline"
          label={`${d.name} — permis ${d.licence}`}
          right={
            <Pressable onPress={() => removeDriver(d.id)} hitSlop={8}>
              <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
            </Pressable>
          }
        />
      ))}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Ajouter un conducteur autorisé</Text>
        <TextInput style={styles.input} placeholder="Nom complet" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Numéro de permis" placeholderTextColor={colors.textMuted} value={licence} onChangeText={setLicence} />
        <Pressable style={[styles.addBtn, (!name.trim() || !licence.trim()) && styles.addBtnDisabled]} onPress={submit}>
          <Text style={styles.addBtnText}>Ajouter</Text>
        </Pressable>
      </View>
      <Text style={styles.hint}>Chaque conducteur ajouté devra être vérifié avant de prendre le véhicule en main.</Text>
    </>
  );
}

// ---- Documents ---------------------------------------------------------
// Liste requise alignée sur le parcours d'inscription (KYC/KYB) — mêmes clés
// que IdentityVerificationScreen, voir data/kycRequirements.js.
function DocumentsSection() {
  const { t } = useTranslation();
  const { user, documents, addDocument, removeDocument } = useAppState();
  const accountType = user.accountType === 'professional' ? 'professional' : 'individual';
  const requiredDocs = KYC_DOCUMENTS[accountType].map((key) => ({ key, label: t(`kyc.${KYC_DOCUMENT_LABEL_KEYS[key]}`) }));

  const handlePick = async (key) => {
    const uri = await pickImage();
    if (uri) addDocument(key, uri);
  };

  return (
    <>
      {requiredDocs.map((doc) => {
        const stored = documents[doc.key];
        return (
          <View key={doc.key} style={styles.docCard}>
            <View style={styles.docCardTop}>
              {stored ? (
                <Image source={{ uri: stored.uri }} style={styles.docThumb} />
              ) : (
                <View style={[styles.docThumb, styles.docThumbEmpty]}><Ionicons name="document-outline" size={22} color={colors.textMuted} /></View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.rowLabel}>{doc.label}</Text>
                <Text style={styles.hint}>{stored ? `Ajouté le ${new Date(stored.addedAt).toLocaleDateString('fr-FR')}` : 'Manquant'}</Text>
              </View>
              {stored ? <Ionicons name="checkmark-circle" size={20} color={colors.green} /> : null}
            </View>
            <View style={styles.docActions}>
              <Pressable style={styles.docActionBtn} onPress={() => handlePick(doc.key)}>
                <Ionicons name="cloud-upload-outline" size={16} color={colors.gold} />
                <Text style={styles.docActionText}>{stored ? 'Remplacer' : 'Ajouter'}</Text>
              </Pressable>
              {stored && (
                <Pressable style={styles.docActionBtn} onPress={() => removeDocument(doc.key)}>
                  <Ionicons name="trash-outline" size={16} color={colors.red} />
                  <Text style={[styles.docActionText, { color: colors.red }]}>Retirer</Text>
                </Pressable>
              )}
            </View>
          </View>
        );
      })}
      <Text style={styles.hint}>La photo est prise depuis la galerie de votre appareil et reste stockée localement dans l'application tant que Supabase Storage n'est pas branché.</Text>
    </>
  );
}

// ---- Paiements ----------------------------------------------------------
function PaymentsSection() {
  const { paymentMethods, addPaymentMethod, removePaymentMethod } = useAppState();
  const [number, setNumber] = useState('');

  const submit = () => {
    const digits = number.replace(/\D/g, '');
    if (digits.length < 4) return;
    const last4 = digits.slice(-4);
    addPaymentMethod({ brand: digits.startsWith('4') ? 'Visa' : digits.startsWith('5') ? 'Mastercard' : 'Carte', last4 });
    setNumber('');
  };

  return (
    <>
      {paymentMethods.map((m) => (
        <Row
          key={m.id}
          icon="card-outline"
          label={`${m.brand} •••• ${m.last4}`}
          right={
            <Pressable onPress={() => removePaymentMethod(m.id)} hitSlop={8}>
              <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
            </Pressable>
          }
        />
      ))}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Ajouter un moyen de paiement</Text>
        <TextInput style={styles.input} placeholder="Numéro de carte" placeholderTextColor={colors.textMuted} value={number} onChangeText={setNumber} keyboardType="number-pad" />
        <Pressable style={[styles.addBtn, number.replace(/\D/g, '').length < 4 && styles.addBtnDisabled]} onPress={submit}>
          <Text style={styles.addBtnText}>Ajouter</Text>
        </Pressable>
        <Text style={styles.hint}>Aucun prestataire de paiement (PSP) n'est encore branché — voir 04_ARCHITECTURE_TECHNIQUE.md. Aucun débit réel n'est effectué ici, seul le numéro masqué est enregistré localement.</Text>
      </View>
    </>
  );
}

// ---- Notifications --------------------------------------------------------
function NotificationsSection() {
  const { notificationPrefs, setNotificationPrefs } = useAppState();
  const items = [
    { key: 'reservations', label: 'Réservations' },
    { key: 'messages', label: 'Messages' },
    { key: 'promotions', label: 'Promotions' },
    { key: 'security', label: 'Sécurité du compte' },
  ];
  return (
    <>
      {items.map((it) => (
        <Row
          key={it.key}
          icon="notifications-outline"
          label={it.label}
          right={
            <Switch
              value={notificationPrefs[it.key]}
              onValueChange={(v) => setNotificationPrefs((p) => ({ ...p, [it.key]: v }))}
              trackColor={{ true: colors.gold, false: colors.cardBorder }}
              thumbColor={colors.white}
            />
          }
        />
      ))}
    </>
  );
}

// ---- Confidentialité --------------------------------------------------------
function PrivacySection({ navigation }) {
  const { user, documents, drivers, paymentMethods, signOut } = useAppState();
  const [showData, setShowData] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // signOut() invalide la session et réinitialise l'état — le switch racine
  // (AppNavigator.js) bascule automatiquement vers l'espace Auth ; aucun
  // navigate() manuel n'est nécessaire (et le stack courant est de toute
  // façon démonté dans la foulée).
  const deleteAccount = () => {
    signOut();
  };

  return (
    <>
      <Row icon="eye-outline" label="Voir mes données" onPress={() => setShowData((v) => !v)} right={<Ionicons name={showData ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textMuted} />} />
      {showData && (
        <View style={styles.dataBox}>
          <Text style={styles.dataLine}>Nom : {user.fullName}</Text>
          <Text style={styles.dataLine}>Pays : {user.countryCode}</Text>
          <Text style={styles.dataLine}>Identité vérifiée : {user.identityVerified ? 'oui' : 'non'}</Text>
          <Text style={styles.dataLine}>Documents enregistrés : {Object.keys(documents).length}</Text>
          <Text style={styles.dataLine}>Conducteurs additionnels : {drivers.length}</Text>
          <Text style={styles.dataLine}>Moyens de paiement : {paymentMethods.length}</Text>
        </View>
      )}

      {!confirmDelete ? (
        <Row icon="trash-outline" label="Supprimer mon compte" danger onPress={() => setConfirmDelete(true)} />
      ) : (
        <View style={styles.confirmBox}>
          <Text style={styles.confirmText}>Cette action efface vos données locales (documents, conducteurs, favoris, réservations démo) et vous déconnecte. Confirmer ?</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable style={styles.confirmBtnCancel} onPress={() => setConfirmDelete(false)}><Text style={styles.confirmBtnCancelText}>Annuler</Text></Pressable>
            <Pressable style={styles.confirmBtnDelete} onPress={deleteAccount}><Text style={styles.confirmBtnDeleteText}>Supprimer</Text></Pressable>
          </View>
        </View>
      )}

      <Text style={styles.policyTitle}>Politique de confidentialité — CAR ONE PLUS</Text>

      <PolicyBlock title="1. Qui sommes-nous">
        CAR ONE PLUS est une plateforme de location et d'autopartage (voitures, utilitaires, motos, vélos,
        trottinettes et, à terme, yachts/aéronefs/jets privés sous cadre réglementaire dédié) mettant en
        relation particuliers, professionnels et notre propre flotte.
      </PolicyBlock>
      <PolicyBlock title="2. Données que nous collectons">
        Identité et vérification (nom, date de naissance, pièce d'identité, permis de conduire, selfie de
        vérification si retenu) ; coordonnées (email, téléphone, adresse) ; données de réservation (véhicule,
        dates, lieu, prix — jamais les données de carte elles-mêmes, voir « Paiement ») ; documents véhicule
        pour les propriétaires (carte grise, attestation d'assurance, contrôle technique) ; données d'usage
        (recherches, favoris, avis, messages, tickets support) ; géolocalisation et télématique uniquement
        lorsqu'un véhicule connecté est activé et pendant la durée de la location, avec un mode hors-location
        prévu dès que possible techniquement et juridiquement.
      </PolicyBlock>
      <PolicyBlock title="3. Finalités">
        Vérifier votre identité et votre permis, traiter réservations et paiements, prévenir la fraude, assurer
        la sécurité et l'assistance pendant la location, respecter nos obligations légales et assurantielles,
        améliorer le service.
      </PolicyBlock>
      <PolicyBlock title="4. Minimisation et durée de conservation">
        Nous ne collectons que les données nécessaires à chaque finalité et ne les conservons que pour la durée
        nécessaire (relation contractuelle, obligations comptables et légales), puis elles sont supprimées ou
        anonymisées.
      </PolicyBlock>
      <PolicyBlock title="5. Partage des données">
        Vos données peuvent être partagées avec notre prestataire de paiement (PSP — non encore sélectionné à
        ce stade), notre prestataire de vérification d'identité (KYC — non encore sélectionné), nos partenaires
        d'assurance par marché et catégorie, et les autorités lorsque la loi l'exige. Nous ne vendons jamais vos
        données à des tiers à des fins publicitaires.
      </PolicyBlock>
      <PolicyBlock title="6. Vos droits">
        Vous pouvez demander à tout moment l'accès, la rectification, l'export ou la suppression de vos données
        personnelles depuis cet écran, sous réserve des obligations légales de conservation (contrats, factures,
        litiges en cours).
      </PolicyBlock>
      <PolicyBlock title="7. Sécurité">
        Chiffrement des données sensibles, contrôle d'accès par rôle, journal d'audit sur les actions sensibles,
        et détection de fraude (moyens de paiement, identité, appareil, réservations multiples, comportement
        anormal).
      </PolicyBlock>
      <PolicyBlock title="8. Contact">
        Pour toute question relative à vos données : support@caroneplus.com (voir aussi l'écran « Aide »).
      </PolicyBlock>
    </>
  );
}

function PolicyBlock({ title, children }) {
  return (
    <View style={styles.policyBlock}>
      <Text style={styles.policyBlockTitle}>{title}</Text>
      <Text style={styles.policyBlockBody}>{children}</Text>
    </View>
  );
}

// ---- Sécurité --------------------------------------------------------
function SecuritySection() {
  const { twoFactorEnabled, setTwoFactorEnabled, sessionStartedAt } = useAppState();
  return (
    <>
      <Row
        icon="shield-checkmark-outline"
        label="Authentification à deux facteurs"
        right={<Switch value={twoFactorEnabled} onValueChange={setTwoFactorEnabled} trackColor={{ true: colors.gold, false: colors.cardBorder }} thumbColor={colors.white} />}
      />
      <Row icon="phone-portrait-outline" label={`Cet appareil (${Platform.OS}) — connecté maintenant`} />
      <Row icon="time-outline" label={`Session ouverte depuis ${new Date(sessionStartedAt).toLocaleTimeString('fr-FR')}`} />
      <Text style={styles.hint}>L'historique multi-appareils nécessite un backend d'authentification réel (non encore branché — voir README).</Text>
    </>
  );
}

// ---- Aide --------------------------------------------------------
const FAQ = [
  { q: 'Comment fonctionne la commission ?', a: 'CAR ONE PLUS prélève 5% de chaque location réalisée via la plateforme, prélevés sur le versement au propriétaire. Les frais d\'assurance, de protection, de livraison et d\'options sont toujours affichés séparément.' },
  { q: "Comment fonctionne le dépôt de garantie ?", a: "Une préautorisation est réalisée à la confirmation de la réservation puis libérée automatiquement à la clôture de la location si aucun dossier n'est ouvert." },
  { q: "Que faire en cas de dommage ?", a: "Signalez-le immédiatement depuis l'écran de la location en cours (« Ajouter un dommage ») ou depuis le centre de résolution d'incident." },
  { q: "Comment annuler une réservation ?", a: "Les conditions d'annulation dépendent du délai avant le départ, du motif et des règles définies par le propriétaire ou la catégorie du véhicule." },
];

function HelpSection() {
  const [open, setOpen] = useState(null);
  const contact = (subject) => Linking.openURL(`mailto:support@caroneplus.com?subject=${encodeURIComponent(subject)}`);

  return (
    <>
      <Text style={styles.policyTitle}>Centre d'aide</Text>
      {FAQ.map((item, i) => (
        <Pressable key={item.q} style={styles.faqCard} onPress={() => setOpen(open === i ? null : i)}>
          <View style={styles.faqHeader}>
            <Text style={styles.faqQuestion}>{item.q}</Text>
            <Ionicons name={open === i ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textMuted} />
          </View>
          {open === i && <Text style={styles.faqAnswer}>{item.a}</Text>}
        </Pressable>
      ))}
      <Row icon="mail-outline" label="Contacter le support" onPress={() => contact('Support CAR ONE PLUS')} />
      <Row icon="warning-outline" label="Signaler un problème" onPress={() => contact('Signalement de problème — CAR ONE PLUS')} />
    </>
  );
}

// ---- Conditions --------------------------------------------------------
function TermsSection() {
  return (
    <>
      <Text style={styles.policyTitle}>Conditions Générales d'Utilisation — CAR ONE PLUS</Text>
      <PolicyBlock title="1. Objet">
        CAR ONE PLUS met en relation des locataires et des propriétaires (particuliers, professionnels) ou notre
        flotte propre pour la location de véhicules et biens de mobilité, selon la catégorie choisie.
      </PolicyBlock>
      <PolicyBlock title="2. Commission">
        CAR ONE PLUS prélève une commission de 5% sur chaque location réalisée via la plateforme, prélevée sur
        le versement au propriétaire. Les frais d'assurance, de protection, de livraison et d'options éventuelles
        sont toujours affichés séparément et clairement avant paiement.
      </PolicyBlock>
      <PolicyBlock title="3. Réservation et paiement">
        Une réservation n'est confirmée qu'après validation du paiement (et, selon le propriétaire, après
        acceptation manuelle si la réservation instantanée n'est pas activée). Un dépôt de garantie peut être
        prélevé par préautorisation et est libéré automatiquement à la clôture de la location en l'absence de
        dossier ouvert.
      </PolicyBlock>
      <PolicyBlock title="4. Annulation">
        Les conditions d'annulation dépendent du délai avant le départ, du motif, de la catégorie de véhicule, et
        des règles définies par le propriétaire ou notre plateforme.
      </PolicyBlock>
      <PolicyBlock title="5. État des lieux">
        Un état des lieux (check-in / check-out) est requis à la prise en main et à la restitution du véhicule.
        Tout dommage constaté doit être signalé sans délai via le centre de résolution d'incident.
      </PolicyBlock>
      <PolicyBlock title="6. Conducteurs">
        Seuls les conducteurs déclarés et vérifiés dans la réservation sont autorisés à conduire le véhicule
        loué.
      </PolicyBlock>
      <PolicyBlock title="7. Assurance">
        La couverture applicable dépend du marché, de la catégorie de véhicule et du partenaire assurance
        retenu. CAR ONE PLUS n'affirme jamais qu'une location est « assurance incluse » sans confirmation
        contractuelle préalable.
      </PolicyBlock>
      <PolicyBlock title="8. Comportement et sécurité">
        Tout comportement frauduleux (identité, paiement, réservations multiples, chargebacks abusifs) peut
        entraîner la suspension du compte.
      </PolicyBlock>
      <PolicyBlock title="9. Catégories premium">
        Les catégories yacht, aéronef et jet privé sont soumises à un cadre juridique, assurantiel et de
        vérification spécifique, activé marché par marché.
      </PolicyBlock>
      <PolicyBlock title="10. Contact et litiges">
        Pour toute question ou réclamation : support@caroneplus.com.
      </PolicyBlock>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14 },
  rowLabel: { ...typography.body, flex: 1 },
  hint: { ...typography.caption, lineHeight: 16 },
  formCard: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14, gap: 10 },
  formTitle: { ...typography.h3, fontSize: 14 },
  input: { backgroundColor: colors.bgElevated, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.cardBorder, paddingHorizontal: 14, height: 44, color: colors.white },
  addBtn: { height: 42, borderRadius: radii.pill, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  addBtnDisabled: { opacity: 0.4 },
  addBtnText: { color: colors.bg, fontWeight: '800' },
  docCard: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14, gap: 10 },
  docCardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  docThumb: { width: 44, height: 44, borderRadius: radii.sm },
  docThumbEmpty: { backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' },
  docActions: { flexDirection: 'row', gap: 16 },
  docActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  docActionText: { color: colors.gold, fontWeight: '700', fontSize: 13 },
  dataBox: { backgroundColor: colors.bgElevated, borderRadius: radii.md, padding: 14, gap: 4 },
  dataLine: { ...typography.caption, color: colors.textSecondary },
  confirmBox: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.red, padding: 14, gap: 10 },
  confirmText: { ...typography.bodyMuted, lineHeight: 18 },
  confirmBtnCancel: { flex: 1, height: 40, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.cardBorder, alignItems: 'center', justifyContent: 'center' },
  confirmBtnCancelText: { color: colors.textSecondary, fontWeight: '700' },
  confirmBtnDelete: { flex: 1, height: 40, borderRadius: radii.pill, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  confirmBtnDeleteText: { color: colors.white, fontWeight: '800' },
  policyTitle: { ...typography.h2, fontSize: 17, marginTop: 8 },
  policyBlock: { gap: 4 },
  policyBlockTitle: { ...typography.h3, fontSize: 13, color: colors.gold },
  policyBlockBody: { ...typography.bodyMuted, lineHeight: 19 },
  faqCard: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14, gap: 8 },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  faqQuestion: { ...typography.body, fontWeight: '700', flex: 1 },
  faqAnswer: { ...typography.bodyMuted, lineHeight: 19 },
});
