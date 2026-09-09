import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii } from '../../theme/colors';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppState } from '../../context/AppStateContext';

export default function ProfileScreen({ navigation }) {
  const { user, setUser } = useAppState();
  const [fullName, setFullName] = useState(user.fullName);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>Profil</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={{ padding: 20, gap: 14 }}>
        <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
        <PrimaryButton label="Enregistrer" onPress={() => { setUser((p) => ({ ...p, fullName })); navigation.goBack(); }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  input: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, paddingHorizontal: 16, height: 52, color: colors.white },
});
