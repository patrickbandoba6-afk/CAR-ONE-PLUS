import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, radii } from '../../theme/colors';

// Écran générique pour les pages Compte simples (Conducteurs, Documents,
// Paiements, Notifications, Confidentialité, Sécurité, Aide, Conditions) —
// paramétré par route.name pour éviter 8 écrans dupliqués.
const CONTENT = {
  Drivers: { title: 'Conducteurs', icon: 'people-outline', items: ['Ajouter un conducteur autorisé', 'Vérification requise avant prise en main du véhicule'] },
  AccountDocuments: { title: 'Documents', icon: 'folder-outline', items: ['Pièce d\'identité — vérifiée', 'Permis de conduire — vérifié'] },
  Payments: { title: 'Paiements', icon: 'card-outline', items: ['Carte •••• 4242', 'Ajouter un moyen de paiement'] },
  Notifications: { title: 'Notifications', icon: 'notifications-outline', items: ['Réservations', 'Messages', 'Promotions', 'Sécurité du compte'] },
  Privacy: { title: 'Confidentialité', icon: 'lock-closed-outline', items: ['Gérer mes données personnelles', 'Exporter mes données', 'Supprimer mon compte'] },
  Security: { title: 'Sécurité', icon: 'shield-checkmark-outline', items: ['Authentification à deux facteurs', 'Appareils connectés', 'Historique de connexion'] },
  Help: { title: 'Aide', icon: 'help-circle-outline', items: ['Centre d\'aide', 'Contacter le support', 'Signaler un problème'] },
  Terms: { title: 'Conditions', icon: 'document-text-outline', items: ['Conditions générales d\'utilisation', 'Politique de confidentialité', 'Conditions d\'assurance'] },
};

export default function AccountInfoScreen({ navigation, route }) {
  const data = CONTENT[route.name];
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>{data.title}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 10 }}>
        {data.items.map((item) => (
          <View key={item} style={styles.row}>
            <Ionicons name={data.icon} size={18} color={colors.gold} />
            <Text style={styles.rowLabel}>{item}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14 },
  rowLabel: { ...typography.body, flex: 1 },
});
