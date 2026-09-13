import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import { fetchOwnerVehicles } from '../../lib/api/vehicles';
import { formatMoney } from '../../utils/format';
import PrimaryButton from '../../components/PrimaryButton';

const LISTING_STATUS_LABEL = { published: 'Publiée', pending: 'En modération', paused: 'En pause', rejected: 'Refusée' };

export default function MyVehiclesScreen({ navigation }) {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState(null);

  useEffect(() => {
    let active = true;
    fetchOwnerVehicles().then((v) => { if (active) setVehicles(v); });
    return () => { active = false; };
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('owner.myVehicles')}</Text>
        <Pressable onPress={() => navigation.navigate('AddVehicle')}><Ionicons name="add-circle" size={28} color={colors.gold} /></Pressable>
      </View>
      {!vehicles ? (
        <ActivityIndicator color={colors.gold} style={{ marginTop: 40 }} />
      ) : (
      <FlatList
        data={vehicles}
        keyExtractor={(v) => v.id}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.photo}><Ionicons name="car-sport" size={22} color={colors.textMuted} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.make} {item.model}</Text>
                <Text style={styles.price}>{formatMoney(item.priceDayMinor, item.currency)}/jour</Text>
              </View>
              <View style={styles.statusBadge}><Text style={styles.statusText}>{LISTING_STATUS_LABEL[item.listingStatus] || 'Publiée'}</Text></View>
            </View>
            <View style={styles.actionsRow}>
              <QuickAction icon="images-outline" label={t('owner.photos')} onPress={() => navigation.navigate('Photos', { vehicleId: item.id })} />
              <QuickAction icon="pricetag-outline" label={t('owner.pricing')} onPress={() => navigation.navigate('Pricing', { vehicleId: item.id })} />
              <QuickAction icon="calendar-outline" label={t('owner.calendar')} onPress={() => navigation.navigate('Calendar', { vehicleId: item.id })} />
              <QuickAction icon="document-text-outline" label={t('owner.documents')} onPress={() => navigation.navigate('Documents', { vehicleId: item.id })} />
            </View>
          </View>
        )}
      />
      )}
    </SafeAreaView>
  );
}

function QuickAction({ icon, label, onPress }) {
  return (
    <Pressable style={styles.quickAction} onPress={onPress}>
      <Ionicons name={icon} size={16} color={colors.gold} />
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8 },
  title: { ...typography.h1 },
  card: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14, gap: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  photo: { width: 48, height: 48, borderRadius: radii.sm, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' },
  name: { ...typography.body, fontWeight: '700' },
  price: { ...typography.caption, marginTop: 2 },
  statusBadge: { backgroundColor: 'rgba(22,163,74,0.15)', borderRadius: radii.sm, paddingHorizontal: 8, paddingVertical: 4 },
  statusText: { color: colors.green, fontSize: 11, fontWeight: '700' },
  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickAction: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.bgElevated, borderRadius: radii.pill, paddingHorizontal: 12, paddingVertical: 7 },
  quickActionLabel: { ...typography.caption, color: colors.textSecondary },
});
