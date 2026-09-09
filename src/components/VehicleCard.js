import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, radii, typography, shadow } from '../theme/colors';
import { formatMoney } from '../utils/format';
import { useAppState } from '../context/AppStateContext';

export default function VehicleCard({ vehicle, onPress, style }) {
  const { t } = useTranslation();
  const { favorites, toggleFavorite } = useAppState();
  const isFav = favorites.includes(vehicle.id);

  return (
    <Pressable onPress={onPress} style={[styles.card, shadow, style]}>
      <View style={styles.photoWrap}>
        {vehicle.photo ? (
          <Image source={{ uri: vehicle.photo }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.photoPlaceholder]}>
            <Ionicons name="car-sport" size={36} color={colors.textMuted} />
          </View>
        )}
        <View style={styles.badge}><Text style={styles.badgeText}>{vehicle.badge}</Text></View>
        <Pressable style={styles.favButton} onPress={() => toggleFavorite(vehicle.id)} hitSlop={8}>
          <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={18} color={isFav ? colors.red : colors.white} />
        </Pressable>
        {vehicle.fleet && (
          <View style={styles.fleetTag}><Text style={styles.fleetTagText}>CAR ONE PLUS</Text></View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{vehicle.make} {vehicle.model}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {vehicle.transmission === 'auto' ? 'Automatique' : vehicle.transmission === 'manual' ? 'Manuelle' : ''}
          {vehicle.transmission && vehicle.fuel ? ' · ' : ''}
          {vehicle.fuel === 'diesel' ? 'Diesel' : vehicle.fuel === 'petrol' ? 'Essence' : vehicle.fuel === 'electric' ? 'Électrique' : ''}
        </Text>
        <View style={styles.row}>
          <Text style={styles.price}>
            {formatMoney(vehicle.priceDayMinor, vehicle.currency)}<Text style={styles.perDay}>{t('vehicle.perDay')}</Text>
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={13} color={colors.gold} />
            <Text style={styles.ratingText}>{vehicle.rating.toFixed(1)} ({vehicle.reviews})</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radii.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.cardBorder },
  photoWrap: { width: '100%', aspectRatio: 1.5, backgroundColor: colors.bgElevated },
  photo: { width: '100%', height: '100%' },
  photoPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(10,13,20,0.75)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: radii.sm },
  badgeText: { color: colors.white, fontSize: 11, fontWeight: '700' },
  favButton: { position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(10,13,20,0.55)', alignItems: 'center', justifyContent: 'center' },
  fleetTag: { position: 'absolute', bottom: 10, left: 10, backgroundColor: colors.gold, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.sm },
  fleetTagText: { fontSize: 10, fontWeight: '800', color: colors.bg },
  info: { padding: 12, gap: 4 },
  title: { ...typography.h3 },
  subtitle: { ...typography.caption },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  price: { color: colors.white, fontWeight: '800', fontSize: 15 },
  perDay: { color: colors.textSecondary, fontWeight: '400', fontSize: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { ...typography.caption, color: colors.textSecondary },
});
