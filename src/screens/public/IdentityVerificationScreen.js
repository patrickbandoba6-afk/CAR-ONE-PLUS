import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import { KYC_STEPS, KYC_DOCUMENTS, KYC_DOCUMENT_LABEL_KEYS } from '../../data/kycRequirements';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppState } from '../../context/AppStateContext';
import { pickImage } from '../../utils/pickImage';
import SignaturePad from '../../components/SignaturePad';

// Parcours de vérification à l'inscription, différent pour un particulier
// (identité + adresse + permis) et un professionnel (entreprise + représentant
// légal + Kbis) — voir data/kycRequirements.js et docs/08_SECURITE...md.
// Personne n'atteint MainTabs sans être passé par ici (ou l'avoir explicitement
// repoussé via "Plus tard").
export default function IdentityVerificationScreen({ navigation }) {
  const { t } = useTranslation();
  const { user, setUser, setMode, documents, addDocument, signature, setSignature } = useAppState();
  const [draftSignature, setDraftSignature] = useState(signature || []);
  const accountType = user.accountType === 'professional' ? 'professional' : 'individual';
  const steps = KYC_STEPS[accountType];
  const requiredDocs = KYC_DOCUMENTS[accountType];

  const [stepIndex, setStepIndex] = useState(0);
  const [fields, setFields] = useState({
    firstName: '', lastName: '', dob: '', phone: '',
    addressLine: '', city: '', postalCode: '',
    companyName: '', registrationNumber: '', legalForm: '',
    legalRepName: '', legalRepRole: '',
  });
  const setField = (key, value) => setFields((prev) => ({ ...prev, [key]: value }));

  const step = steps[stepIndex];

  const canProceed = useMemo(() => {
    switch (step) {
      case 'identity': return Boolean(fields.firstName && fields.lastName && fields.dob);
      case 'address': return Boolean(fields.addressLine && fields.city && fields.postalCode);
      case 'company': return Boolean(fields.companyName && fields.registrationNumber);
      case 'representative': return Boolean(fields.legalRepName && fields.legalRepRole);
      case 'documents': return requiredDocs.every((key) => documents[key]);
      case 'signature': return draftSignature.length > 0;
      default: return true;
    }
  }, [step, fields, documents, requiredDocs, draftSignature]);

  const handlePick = async (key) => {
    const uri = await pickImage();
    if (uri) addDocument(key, uri);
  };

  const finish = () => {
    if (draftSignature.length > 0) setSignature(draftSignature);
    const fullName = `${fields.firstName} ${fields.lastName}`.trim() || user.fullName;
    if (accountType === 'professional') {
      setUser((prev) => ({
        ...prev,
        fullName,
        phone: fields.phone || prev.phone,
        identityVerified: true,
        company: {
          ...prev.company,
          name: fields.companyName,
          registrationNumber: fields.registrationNumber,
          legalForm: fields.legalForm,
          legalRepName: fields.legalRepName,
          legalRepRole: fields.legalRepRole,
          verified: true,
        },
      }));
      setMode('professional');
    } else {
      setUser((prev) => ({
        ...prev,
        fullName,
        firstName: fields.firstName,
        lastName: fields.lastName,
        dateOfBirth: fields.dob,
        phone: fields.phone || prev.phone,
        addressLine: fields.addressLine,
        city: fields.city,
        postalCode: fields.postalCode,
        identityVerified: true,
        licenceVerified: true,
        addressVerified: true,
      }));
    }
    navigation.replace('MainTabs');
  };

  const goNext = () => {
    if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1);
    else finish();
  };
  const goBack = () => (stepIndex === 0 ? navigation.goBack() : setStepIndex(stepIndex - 1));

  const STEP_TITLES = {
    identity: t('kyc.stepIdentity'), address: t('kyc.stepAddress'),
    company: t('kyc.stepCompany'), representative: t('kyc.stepRepresentative'),
    documents: t('kyc.stepDocuments'), signature: t('kyc.stepSignature'),
  };
  const DOC_LABELS = Object.fromEntries(
    Object.entries(KYC_DOCUMENT_LABEL_KEYS).map(([docKey, i18nKey]) => [docKey, t(`kyc.${i18nKey}`)])
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={goBack}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>{accountType === 'professional' ? t('kyc.titleProfessional') : t('kyc.titleIndividual')}</Text>
        <Text style={styles.stepCount}>{stepIndex + 1}/{steps.length}</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${((stepIndex + 1) / steps.length) * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
        <Text style={styles.title}>{STEP_TITLES[step]}</Text>

        {step === 'identity' && (
          <>
            <TextInput style={styles.input} placeholder={t('kyc.firstName')} placeholderTextColor={colors.textMuted} value={fields.firstName} onChangeText={(v) => setField('firstName', v)} />
            <TextInput style={styles.input} placeholder={t('kyc.lastName')} placeholderTextColor={colors.textMuted} value={fields.lastName} onChangeText={(v) => setField('lastName', v)} />
            <TextInput style={styles.input} placeholder={t('kyc.dobPlaceholder')} placeholderTextColor={colors.textMuted} value={fields.dob} onChangeText={(v) => setField('dob', v)} keyboardType="numbers-and-punctuation" />
            <TextInput style={styles.input} placeholder={t('kyc.phone')} placeholderTextColor={colors.textMuted} value={fields.phone} onChangeText={(v) => setField('phone', v)} keyboardType="phone-pad" />
          </>
        )}

        {step === 'address' && (
          <>
            <TextInput style={styles.input} placeholder={t('kyc.addressLine')} placeholderTextColor={colors.textMuted} value={fields.addressLine} onChangeText={(v) => setField('addressLine', v)} />
            <View style={styles.rowInputs}>
              <TextInput style={[styles.input, { flex: 1 }]} placeholder={t('kyc.city')} placeholderTextColor={colors.textMuted} value={fields.city} onChangeText={(v) => setField('city', v)} />
              <TextInput style={[styles.input, { flex: 1 }]} placeholder={t('kyc.postalCode')} placeholderTextColor={colors.textMuted} value={fields.postalCode} onChangeText={(v) => setField('postalCode', v)} keyboardType="number-pad" />
            </View>
          </>
        )}

        {step === 'company' && (
          <>
            <TextInput style={styles.input} placeholder={t('kyc.companyName')} placeholderTextColor={colors.textMuted} value={fields.companyName} onChangeText={(v) => setField('companyName', v)} />
            <TextInput style={styles.input} placeholder={t('kyc.registrationNumber')} placeholderTextColor={colors.textMuted} value={fields.registrationNumber} onChangeText={(v) => setField('registrationNumber', v)} />
            <TextInput style={styles.input} placeholder={t('kyc.legalForm')} placeholderTextColor={colors.textMuted} value={fields.legalForm} onChangeText={(v) => setField('legalForm', v)} />
          </>
        )}

        {step === 'representative' && (
          <>
            <TextInput style={styles.input} placeholder={t('kyc.legalRepName')} placeholderTextColor={colors.textMuted} value={fields.legalRepName} onChangeText={(v) => setField('legalRepName', v)} />
            <TextInput style={styles.input} placeholder={t('kyc.legalRepRole')} placeholderTextColor={colors.textMuted} value={fields.legalRepRole} onChangeText={(v) => setField('legalRepRole', v)} />
            <TextInput style={styles.input} placeholder={t('kyc.phone')} placeholderTextColor={colors.textMuted} value={fields.phone} onChangeText={(v) => setField('phone', v)} keyboardType="phone-pad" />
          </>
        )}

        {step === 'documents' && (
          <>
            {requiredDocs.map((key) => {
              const stored = documents[key];
              return (
                <View key={key} style={styles.docCard}>
                  {stored ? (
                    <Image source={{ uri: stored.uri }} style={styles.docThumb} />
                  ) : (
                    <View style={[styles.docThumb, styles.docThumbEmpty]}><Ionicons name="document-outline" size={20} color={colors.textMuted} /></View>
                  )}
                  <Text style={styles.docLabel}>{DOC_LABELS[key]}</Text>
                  <Pressable style={styles.docBtn} onPress={() => handlePick(key)}>
                    <Ionicons name={stored ? 'checkmark-circle' : 'cloud-upload-outline'} size={20} color={stored ? colors.green : colors.gold} />
                  </Pressable>
                </View>
              );
            })}
            <Text style={styles.hint}>{t('kyc.docsHint')}</Text>
          </>
        )}

        {step === 'signature' && (
          <>
            <Text style={styles.hint}>{t('kyc.signatureBody')}</Text>
            <SignaturePad value={draftSignature} onChange={setDraftSignature} />
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label={stepIndex === steps.length - 1 ? t('kyc.submit') : t('common.next')} onPress={goNext} disabled={!canProceed} />
        <Pressable onPress={() => navigation.replace('MainTabs')}>
          <Text style={styles.skip}>{t('kyc.later')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3, flex: 1, textAlign: 'center' },
  stepCount: { ...typography.caption },
  progressTrack: { height: 3, backgroundColor: colors.cardBorder, marginHorizontal: 20, borderRadius: 2 },
  progressFill: { height: 3, backgroundColor: colors.gold, borderRadius: 2 },
  title: { ...typography.h2, fontSize: 19 },
  input: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, paddingHorizontal: 16, height: 52, color: colors.white },
  rowInputs: { flexDirection: 'row', gap: 10 },
  docCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 12 },
  docThumb: { width: 40, height: 40, borderRadius: radii.sm },
  docThumbEmpty: { backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' },
  docLabel: { ...typography.body, flex: 1 },
  docBtn: { padding: 4 },
  hint: { ...typography.caption, lineHeight: 18, marginTop: 4 },
  footer: { padding: 20, gap: 10, borderTopWidth: 1, borderTopColor: colors.cardBorder },
  skip: { color: colors.textSecondary, textAlign: 'center' },
});
