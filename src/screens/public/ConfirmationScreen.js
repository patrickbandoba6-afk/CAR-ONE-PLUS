import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import PrimaryButton from '../../components/PrimaryButton';

export default function ConfirmationScreen({ navigation, route }) {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrap}><Ionicons name="checkmark" size={44} color={colors.bg} /></View>
        <Text style={styles.title}>{t('booking.confirmation')}</Text>
        <Text style={styles.body}>Votre contrat électronique et vos instructions d'accès sont disponibles dans « Mes réservations ».</Text>
      </View>
      <View style={styles.footer}>
        <PrimaryButton label="Voir ma réservation" onPress={() => navigation.replace('MainTabs', { screen: 'BookingsTab' })} />
        <PrimaryButton label="Retour à l'accueil" variant="outline" onPress={() => navigation.replace('MainTabs')} style={{ marginTop: 10 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 14 },
  iconWrap: { width: 84, height: 84, borderRadius: radii.pill, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  title: { ...typography.h1, textAlign: 'center' },
  body: { ...typography.bodyMuted, textAlign: 'center', lineHeight: 20 },
  footer: { padding: 24 },
});
