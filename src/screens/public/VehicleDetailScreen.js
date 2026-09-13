import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii, shadow } from '../../theme/colors';
import { fetchVehicleById } from '../../lib/api/vehicles';
import { CATEGORY_LABELS } from '../../data/categories';
import { formatMoney } from '../../utils/format';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppState } from '../../context/AppStateContext';

const AMENITIES = ['Climatisation', 'GPS', 'Bluetooth', 'Siège bébé disponible', 'Caméra de recul'];

export default function VehicleDetailScreen({ navigation, route }) {
  const { t } = useTranslation();
  const [vehicle, setVehicle] = useState(null);
  const { favorites, toggleFavorite, setBookingDraft } = useAppState();

  useEffect(() => {
    let active = true;
    fetchVehicleById(route.params.vehicleId).then((v) => { if (active) setVehicle(v); });
    return () => { active = false; };
  }, [route.params.vehicleId]);

  if (!vehicle) {
    return (
      <SafeAreaView style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.gold} />
      </SafeAreaView>
    );
  }
  const isFav = favorites.includes(vehicle.id);

  const startBooking = () => {
    setBookingDraft({ vehicleId: vehicle.id, vehicle, days: 1, protection: false, options: [] });
    navigation.navigate('PriceDetails', { vehicleId: vehicle.id });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => navigation.navigate('Gallery', { vehicleId: vehicle.id, vehicle })}>
          {vehicle.photo ? (
            <Image source={{ uri: vehicle.photo }} style={styles.hero} />
          ) : (
            <View style={[styles.hero, styles.heroPlaceholder]}><Ionicons name="car-sport" size={64} color={colors.textMuted} /></View>
          )}
        </Pressable>
        <View style={styles.headerRow}>
          <Pressable style={styles.roundBtn} onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={22} color={colors.white} /></Pressable>
          <Pressable style={styles.roundBtn} onPress={() => toggleFavorite(vehicle.id)}>
            <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={20} color={isFav ? colors.red : colors.white} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{vehicle.make} {vehicle.model}{vehicle.version ? ` — ${vehicle.version}` : ''}</Text>
          <Text style={styles.subtitle}>{CATEGORY_LABELS[vehicle.category]} · {vehicle.year || ''}</Text>
          <View style={styles.row}>
            <Ionicons name="star" size={15} color={colors.gold} />
            <Text style={styles.ratingText}>{vehicle.rating.toFixed(1)} ({vehicle.reviews} {t('vehicle.reviews')})</Text>
            <Text style={styles.dot}>·</Text>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.locationText}>{vehicle.locationLabel}</Text>
          </View>

          <View style={styles.ownerCard}>
            <Ionicons name={vehicle.fleet ? 'business' : 'person-circle-outline'} size={28} color={colors.gold} />
            <View style={{ flex: 1 }}>
              <Text style={styles.ownerLabel}>{vehicle.fleet ? t('vehicle.fleetOwner') : t('vehicle.owner')}</Text>
              <Text style={styles.ownerName}>{vehicle.ownerName}</Text>
            </View>
            {vehicle.instantBooking && (
              <View style={styles.instantBadge}><Text style={styles.instantBadgeText}>Instantané</Text></View>
            )}
          </View>

          <Section title={t('vehicle.amenities')}>
            <View style={styles.chipsWrap}>
              {AMENITIES.map((a) => (
                <View key={a} style={styles.amenityChip}><Text style={styles.amenityText}>{a}</Text></View>
              ))}
            </View>
          </Section>

          <Section title="Mode de remise">
            <View style={styles.pickupRow}>
              <PickupOption icon="key-outline" label={t('vehicle.pickupDigitalKey')} active={vehicle.digitalKey} />
              <PickupOption icon="people-outline" label={t('vehicle.pickupMeetup')} active />
              <PickupOption icon="business-outline" label={t('vehicle.pickupAgency')} active={vehicle.fleet} />
            </View>
          </Section>

          {vehicle.includedKmPerDay != null && (
            <Section title={t('vehicle.included_km')}>
              <View style={styles.kmCard}>
                <Ionicons name="speedometer-outline" size={20} color={colors.gold} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.kmValue}>{vehicle.includedKmPerDay} km {t('vehicle.perDay')}</Text>
                  {vehicle.extraKmPriceMinor != null && (
                    <Text style={styles.kmSub}>Au-delà : {formatMoney(vehicle.extraKmPriceMinor, vehicle.currency)} / km supplémentaire</Text>
                  )}
                </View>
              </View>
            </Section>
          )}

          <Section title={t('vehicle.fuelPolicy')}>
            <Text style={styles.bodyText}>Retour avec le même niveau de carburant/batterie qu'au départ.</Text>
          </Section>

          <Section title={t('vehicle.protection')}>
            <Text style={styles.bodyText}>La couverture applicable est confirmée avant la réservation, une fois le partenaire assurance validé pour cette catégorie et ce marché.</Text>
          </Section>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerPrice}>{formatMoney(vehicle.priceDayMinor, vehicle.currency)}<Text style={styles.footerPerDay}>{t('vehicle.perDay')}</Text></Text>
          {vehicle.deposit ? <Text style={styles.footerDeposit}>{t('vehicle.deposit')} incl.</Text> : null}
        </View>
        <PrimaryButton label={t('vehicle.book')} onPress={startBooking} style={{ flex: 1, marginLeft: 16 }} />
      </View>
    </SafeAreaView>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function PickupOption({ icon, label, active }) {
  return (
    <View style={[styles.pickupOption, !active && styles.pickupOptionInactive]}>
      <Ionicons name={icon} size={18} color={active ? colors.gold : colors.textMuted} />
      <Text style={[styles.pickupLabel, !active && { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  hero: { width: '100%', aspectRatio: 1.4 },
  heroPlaceholder: { backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' },
  headerRow: { position: 'absolute', top: 16, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' },
  roundBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(10,13,20,0.6)', alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20 },
  title: { ...typography.h1, fontSize: 22 },
  subtitle: { ...typography.bodyMuted, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10 },
  ratingText: { ...typography.body, fontWeight: '700' },
  dot: { color: colors.textMuted },
  locationText: { ...typography.caption },
  ownerCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14, marginTop: 20 },
  ownerLabel: { ...typography.caption },
  ownerName: { ...typography.body, fontWeight: '700' },
  instantBadge: { backgroundColor: colors.green, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radii.sm },
  instantBadgeText: { color: colors.white, fontSize: 10, fontWeight: '800' },
  section: { marginTop: 22 },
  sectionTitle: { ...typography.h3, marginBottom: 10 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenityChip: { backgroundColor: colors.card, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.cardBorder, paddingHorizontal: 12, paddingVertical: 7 },
  amenityText: { ...typography.caption, color: colors.textSecondary },
  pickupRow: { flexDirection: 'row', gap: 10 },
  pickupOption: { flex: 1, alignItems: 'center', gap: 6, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.gold, padding: 12 },
  pickupOptionInactive: { borderColor: colors.cardBorder, opacity: 0.5 },
  pickupLabel: { ...typography.caption, color: colors.white, textAlign: 'center' },
  kmCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14 },
  kmValue: { ...typography.body, fontWeight: '700' },
  kmSub: { ...typography.caption, marginTop: 2 },
  bodyText: { ...typography.bodyMuted, lineHeight: 20 },
  footer: { flexDirection: 'row', alignItems: 'center', padding: 20, borderTopWidth: 1, borderTopColor: colors.cardBorder, backgroundColor: colors.bg },
  footerPrice: { color: colors.white, fontWeight: '800', fontSize: 20 },
  footerPerDay: { color: colors.textSecondary, fontWeight: '400', fontSize: 13 },
  footerDeposit: { ...typography.caption, marginTop: 2 },
});
