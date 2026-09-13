import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii } from '../../theme/colors';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppState } from '../../context/AppStateContext';
import { pickImage } from '../../utils/pickImage';

// Profil complet — commun aux deux profils (locataire/particulier et
// professionnel) : photo, adresse, e-mail, téléphone. Le nom affiché diffère
// (personne physique vs entreprise, voir user.company) mais les coordonnées
// de contact restent celles de la personne connectée dans les deux cas.
export default function ProfileScreen({ navigation }) {
  const { user, setUser } = useAppState();
  const isProfessional = user.accountType === 'professional';
  const [avatarUri, setAvatarUri] = useState(user.avatarUri);
  const [fullName, setFullName] = useState(user.fullName || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [addressLine, setAddressLine] = useState(user.addressLine || '');
  const [city, setCity] = useState(user.city || '');
  const [postalCode, setPostalCode] = useState(user.postalCode || '');

  const changeAvatar = async () => {
    const uri = await pickImage();
    if (uri) setAvatarUri(uri);
  };

  const save = () => {
    setUser((prev) => ({
      ...prev, avatarUri, fullName: fullName.trim() || prev.fullName,
      email: email.trim(), phone: phone.trim(),
      addressLine: addressLine.trim(), city: city.trim(), postalCode: postalCode.trim(),
    }));
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>Profil</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <View style={styles.avatarRow}>
          <Pressable onPress={changeAvatar}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarEmpty]}><Ionicons name="person" size={34} color={colors.gold} /></View>
            )}
            <View style={styles.avatarBadge}><Ionicons name="camera" size={14} color={colors.bg} /></View>
          </Pressable>
          <Pressable onPress={changeAvatar}>
            <Text style={styles.avatarLabel}>{avatarUri ? 'Changer la photo' : 'Ajouter une photo'}</Text>
          </Pressable>
          {isProfessional && user.company?.name ? (
            <View style={styles.companyTag}><Ionicons name="business" size={13} color={colors.gold} /><Text style={styles.companyTagText}>{user.company.name}</Text></View>
          ) : null}
        </View>

        <Field label={isProfessional ? 'Nom du contact' : 'Nom complet'} value={fullName} onChangeText={setFullName} />
        <Field label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Field label="Téléphone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

        <Text style={styles.sectionLabel}>Adresse</Text>
        <Field label="Adresse" value={addressLine} onChangeText={setAddressLine} />
        <View style={styles.row}>
          <Field label="Ville" value={city} onChangeText={setCity} style={{ flex: 1 }} />
          <Field label="Code postal" value={postalCode} onChangeText={setPostalCode} keyboardType="number-pad" style={{ flex: 1 }} />
        </View>

        <PrimaryButton label="Enregistrer" onPress={save} style={{ marginTop: 8 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, style, ...inputProps }) {
  return (
    <View style={style}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor={colors.textMuted} {...inputProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  avatarRow: { alignItems: 'center', gap: 8, marginBottom: 8 },
  avatar: { width: 92, height: 92, borderRadius: 46 },
  avatarEmpty: { backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.cardBorder },
  avatarBadge: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.bg },
  avatarLabel: { color: colors.gold, fontWeight: '700', fontSize: 13, marginTop: 4 },
  companyTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.card, borderRadius: radii.pill, paddingHorizontal: 12, paddingVertical: 6, marginTop: 6 },
  companyTagText: { ...typography.caption, color: colors.textSecondary },
  sectionLabel: { ...typography.h3, fontSize: 14, color: colors.gold, marginTop: 4 },
  fieldLabel: { ...typography.caption, marginBottom: 6 },
  input: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, paddingHorizontal: 16, height: 52, color: colors.white },
  row: { flexDirection: 'row', gap: 10 },
});
