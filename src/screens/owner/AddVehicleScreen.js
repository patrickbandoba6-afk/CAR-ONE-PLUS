import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii } from '../../theme/colors';
import { CATEGORIES } from '../../data/categories';
import { CATEGORY_LABELS } from '../../data/categories';
import { CATEGORY_REQUIREMENTS, LISTING_STEPS } from '../../data/categoryRequirements';
import PrimaryButton from '../../components/PrimaryButton';
import { pickImage } from '../../utils/pickImage';
import { useAppState } from '../../context/AppStateContext';

const ALL_CATEGORIES = Object.keys(CATEGORY_REQUIREMENTS);

// Assistant de mise en location — personne ne publie sans avoir fourni les
// photos et documents requis pour sa catégorie (08_SECURITE_ASSURANCE_CONFORMITE.md,
// category_requirements dans supabase/schema.sql). Sert à la fois au
// particulier ("Mettre en location") et au professionnel (Ma flotte) — le
// bien publié est réellement enregistré dans myListings (auparavant l'assistant
// ne persistait nulle part, l'annonce "disparaissait" après publication).
export default function AddVehicleScreen({ navigation }) {
  const { user, addListing } = useAppState();
  const isProfessional = user.accountType === 'professional';
  const [stepIndex, setStepIndex] = useState(0);
  const [category, setCategory] = useState(null);
  const [basicInfo, setBasicInfo] = useState({ make: '', model: '', year: '' });
  const [photos, setPhotos] = useState([]);
  const photoCount = photos.length;
  const addPhoto = async () => {
    const uri = await pickImage();
    if (uri) setPhotos((p) => [...p, uri]);
  };
  const [docsChecked, setDocsChecked] = useState({});
  const [pricePerDay, setPricePerDay] = useState('');
  const [includedKm, setIncludedKm] = useState('200');
  const [extraKmPrice, setExtraKmPrice] = useState('0.30');
  const [accessMode, setAccessMode] = useState('meetup');
  const [rulesAccepted, setRulesAccepted] = useState(false);

  const requirements = category ? CATEGORY_REQUIREMENTS[category] : null;
  const step = LISTING_STEPS[stepIndex];

  const canProceed = useMemo(() => {
    switch (step) {
      case 'category': return Boolean(category);
      case 'basic_info': return basicInfo.make && basicInfo.model && basicInfo.year;
      case 'photos': return requirements && photoCount >= requirements.minPhotos;
      case 'documents': return requirements ? requirements.documents.every((d) => docsChecked[d]) : true;
      case 'pricing': return Boolean(pricePerDay);
      case 'access_mode': return Boolean(accessMode);
      case 'rules': return rulesAccepted;
      default: return true;
    }
  }, [step, category, basicInfo, photoCount, docsChecked, pricePerDay, accessMode, rulesAccepted, requirements]);

  const goNext = () => {
    if (stepIndex < LISTING_STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
      return;
    }
    addListing({
      category,
      ownerKind: isProfessional ? 'professional' : 'individual',
      ownerName: user.company?.name || user.fullName,
      make: basicInfo.make,
      model: basicInfo.model,
      year: Number(basicInfo.year) || null,
      photo: photos[0] || null,
      photos,
      priceDayMinor: Math.round(Number(pricePerDay) * 100) || 0,
      currency: 'EUR',
      includedKmPerDay: Number(includedKm) || null,
      extraKmPriceMinor: Math.round(Number(extraKmPrice) * 100) || null,
      pickupMode: accessMode,
      status: 'pending_moderation',
    });
    navigation.replace(isProfessional ? 'Fleet' : 'OwnerDashboard', { justPublished: true });
  };
  const goBack = () => (stepIndex === 0 ? navigation.goBack() : setStepIndex(stepIndex - 1));

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={goBack}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>Mettre en location</Text>
        <Text style={styles.stepCount}>{stepIndex + 1}/{LISTING_STEPS.length}</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${((stepIndex + 1) / LISTING_STEPS.length) * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        {step === 'category' && (
          <>
            <Text style={styles.title}>Quel type de bien souhaitez-vous mettre en location ?</Text>
            <View style={styles.grid}>
              {CATEGORIES.flatMap((c) => c.filterCategories).filter((v, i, a) => a.indexOf(v) === i).map((catId) => {
                const req = CATEGORY_REQUIREMENTS[catId];
                const disabled = req && !req.active;
                return (
                  <Pressable
                    key={catId}
                    style={[styles.catCard, category === catId && styles.catCardActive, disabled && styles.catCardDisabled]}
                    onPress={() => !disabled && setCategory(catId)}
                  >
                    <Text style={[styles.catLabel, category === catId && { color: colors.gold }]}>{CATEGORY_LABELS[catId] || catId}</Text>
                    {disabled && <Text style={styles.soonTag}>Bientôt disponible</Text>}
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        {step === 'basic_info' && (
          <>
            <Text style={styles.title}>Informations de base</Text>
            <TextInput style={styles.input} placeholder="Marque (ex: Peugeot)" placeholderTextColor={colors.textMuted} value={basicInfo.make} onChangeText={(v) => setBasicInfo((p) => ({ ...p, make: v }))} />
            <TextInput style={styles.input} placeholder="Modèle (ex: 208)" placeholderTextColor={colors.textMuted} value={basicInfo.model} onChangeText={(v) => setBasicInfo((p) => ({ ...p, model: v }))} />
            <TextInput style={styles.input} placeholder="Année" placeholderTextColor={colors.textMuted} value={basicInfo.year} onChangeText={(v) => setBasicInfo((p) => ({ ...p, year: v }))} keyboardType="number-pad" />
          </>
        )}

        {step === 'photos' && requirements && (
          <>
            <Text style={styles.title}>Photos</Text>
            <Text style={styles.body}>Un minimum de {requirements.minPhotos} photos est requis pour cette catégorie (extérieur, intérieur, compteur, équipements).</Text>
            <View style={styles.photoGrid}>
              {photos.map((uri) => (
                <Image key={uri} source={{ uri }} style={styles.photoTileImg} />
              ))}
              <Pressable style={styles.photoZone} onPress={addPhoto}>
                <Ionicons name="camera-outline" size={24} color={colors.gold} />
                <Text style={styles.photoZoneText}>Ajouter</Text>
              </Pressable>
            </View>
            <Text style={styles.body}>{photoCount} / {requirements.minPhotos} photos ajoutées</Text>
          </>
        )}

        {step === 'documents' && requirements && (
          <>
            <Text style={styles.title}>Documents requis</Text>
            {requirements.documents.length === 0 ? (
              <Text style={styles.body}>Aucun document véhicule n'est requis pour cette catégorie.</Text>
            ) : (
              requirements.documents.map((doc) => (
                <Pressable key={doc} style={[styles.docRow, docsChecked[doc] && styles.docRowDone]} onPress={() => setDocsChecked((p) => ({ ...p, [doc]: !p[doc] }))}>
                  <Ionicons name="document-attach-outline" size={20} color={colors.gold} />
                  <Text style={styles.docLabel}>{doc}</Text>
                  <Ionicons name={docsChecked[doc] ? 'checkmark-circle' : 'cloud-upload-outline'} size={20} color={docsChecked[doc] ? colors.green : colors.textMuted} />
                </Pressable>
              ))
            )}
            {requirements.professionalOnly && (
              <View style={styles.noticeBox}><Ionicons name="business-outline" size={16} color={colors.amber} /><Text style={styles.noticeText}>Cette catégorie est réservée aux comptes professionnels vérifiés.</Text></View>
            )}
          </>
        )}

        {step === 'pricing' && (
          <>
            <Text style={styles.title}>Tarification</Text>
            <TextInput style={styles.input} placeholder="Prix par jour (€)" placeholderTextColor={colors.textMuted} value={pricePerDay} onChangeText={setPricePerDay} keyboardType="numeric" />
            <Text style={styles.body}>CAR ONE PLUS prélève une commission de 5% sur chaque location réalisée via la plateforme. Le reste vous est versé.</Text>

            <Text style={styles.subTitle}>Kilométrage</Text>
            <View style={styles.rowInputs}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Km inclus / jour</Text>
                <TextInput style={styles.input} placeholder="200" placeholderTextColor={colors.textMuted} value={includedKm} onChangeText={setIncludedKm} keyboardType="number-pad" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Prix / km supp. (€)</Text>
                <TextInput style={styles.input} placeholder="0.30" placeholderTextColor={colors.textMuted} value={extraKmPrice} onChangeText={setExtraKmPrice} keyboardType="numeric" />
              </View>
            </View>
            <Text style={styles.body}>Le locataire voit ce kilométrage inclus sur l'annonce ; tout dépassement constaté à la restitution est facturé au tarif indiqué.</Text>
          </>
        )}

        {step === 'access_mode' && (
          <>
            <Text style={styles.title}>Mode de remise</Text>
            {[{ id: 'meetup', label: 'Remise en main propre' }, { id: 'agency', label: 'Point agence' }, { id: 'digital_key', label: 'Clé digitale (boîtier requis)' }].map((opt) => (
              <Pressable key={opt.id} style={[styles.docRow, accessMode === opt.id && styles.docRowDone]} onPress={() => setAccessMode(opt.id)}>
                <Text style={styles.docLabel}>{opt.label}</Text>
                <Ionicons name={accessMode === opt.id ? 'radio-button-on' : 'radio-button-off'} size={20} color={accessMode === opt.id ? colors.gold : colors.textMuted} />
              </Pressable>
            ))}
          </>
        )}

        {step === 'rules' && (
          <>
            <Text style={styles.title}>Conditions et engagement</Text>
            <Text style={styles.body}>En publiant votre annonce, vous confirmez que les informations fournies sont exactes, que le bien est assuré conformément à la réglementation applicable, et vous acceptez que l'annonce passe en modération avant publication.</Text>
            <Pressable style={styles.docRow} onPress={() => setRulesAccepted((v) => !v)}>
              <Text style={styles.docLabel}>J'accepte les conditions de mise en location</Text>
              <Ionicons name={rulesAccepted ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={rulesAccepted ? colors.green : colors.textMuted} />
            </Pressable>
          </>
        )}

        {step === 'review' && (
          <>
            <Text style={styles.title}>Récapitulatif</Text>
            <View style={styles.summaryCard}>
              <SummaryRow label="Catégorie" value={CATEGORY_LABELS[category] || category} />
              <SummaryRow label="Véhicule" value={`${basicInfo.make} ${basicInfo.model} (${basicInfo.year})`} />
              <SummaryRow label="Photos" value={`${photoCount} photos`} />
              <SummaryRow label="Prix" value={`${pricePerDay} €/jour`} />
              <SummaryRow label="Kilométrage" value={`${includedKm} km/jour inclus, +${extraKmPrice} €/km`} />
              <SummaryRow label="Remise" value={accessMode} />
            </View>
            <View style={styles.noticeBox}>
              <Ionicons name="time-outline" size={16} color={colors.amber} />
              <Text style={styles.noticeText}>Votre annonce sera examinée par notre équipe avant d'être visible publiquement.</Text>
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label={step === 'review' ? 'Envoyer pour modération' : 'Suivant'} onPress={goNext} disabled={!canProceed} />
      </View>
    </SafeAreaView>
  );
}

function SummaryRow({ label, value }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  stepCount: { ...typography.caption },
  progressTrack: { height: 3, backgroundColor: colors.cardBorder, marginHorizontal: 20, borderRadius: 2 },
  progressFill: { height: 3, backgroundColor: colors.gold, borderRadius: 2 },
  title: { ...typography.h2, fontSize: 19 },
  subTitle: { ...typography.h3, fontSize: 14, marginTop: 4 },
  body: { ...typography.bodyMuted, lineHeight: 20 },
  input: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, paddingHorizontal: 16, height: 52, color: colors.white },
  rowInputs: { flexDirection: 'row', gap: 10 },
  fieldLabel: { ...typography.caption, marginBottom: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catCard: { width: '47%', backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14, gap: 4 },
  catCardActive: { borderColor: colors.gold },
  catCardDisabled: { opacity: 0.45 },
  catLabel: { ...typography.body, fontWeight: '700' },
  soonTag: { ...typography.caption, color: colors.amber },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  photoTileImg: { width: '30%', aspectRatio: 1, borderRadius: radii.md },
  photoZone: { width: '30%', aspectRatio: 1, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 4 },
  photoZoneText: { ...typography.caption },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14 },
  docRowDone: { borderColor: colors.green },
  docLabel: { ...typography.body, flex: 1 },
  noticeBox: { flexDirection: 'row', gap: 8, backgroundColor: colors.bgElevated, borderRadius: radii.md, padding: 12, alignItems: 'flex-start' },
  noticeText: { ...typography.caption, flex: 1, lineHeight: 17 },
  summaryCard: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 16, gap: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { ...typography.caption },
  summaryValue: { ...typography.body, fontWeight: '700' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.cardBorder },
});
