import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, TextInput, StyleSheet, ImageBackground, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii, shadow } from '../../theme/colors';
import { CATEGORIES } from '../../data/categories';
import { CATEGORY_REQUIREMENTS } from '../../data/categoryRequirements';
import { USAGE_PRESETS } from '../../data/usagePresets';
import { fetchVehicles } from '../../lib/api/vehicles';
import CategoryChip from '../../components/CategoryChip';
import VehicleCard from '../../components/VehicleCard';
import SectionHeader from '../../components/SectionHeader';
import SideMenu from '../../components/SideMenu';
import { useAppState } from '../../context/AppStateContext';

const RENTAL_OPTIONS = [
  { id: 'short', icon: 'calendar-outline', label: 'Location courte durée' },
  { id: 'long', icon: 'calendar-outline', label: 'Location longue durée' },
  { id: 'driver', icon: 'person-outline', label: 'Chauffeur privé' },
];

const FEATURES = [
  { icon: 'globe-outline', titleKey: 'home.trustBadges.global', bodyKey: null, body: 'Disponible dans plus de 180 pays' },
  { icon: 'diamond-outline', titleKey: 'home.trustBadges.pricing', body: 'Des prix transparents, sans frais cachés' },
  { icon: 'shield-checkmark-outline', titleKey: 'home.trustBadges.insurance', body: 'Roulez en toute sérénité' },
  { icon: 'headset-outline', titleKey: 'home.trustBadges.support', body: 'Toujours à votre écoute' },
];

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const { setSearchFilters } = useAppState();
  const [allVehicles, setAllVehicles] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    let active = true;
    fetchVehicles({}).then((vehicles) => {
      if (active) setAllVehicles(vehicles);
    });
    return () => { active = false; };
  }, []);

  // Une section "populaires" par type de bien — le catalogue est trop large
  // (vélo → jet privé) pour se limiter à une seule liste mélangée qui ferait
  // doublon avec la première catégorie (ex. "Voitures populaires").
  const categorySections = CATEGORIES
    .map((cat) => ({ cat, items: allVehicles.filter((v) => cat.filterCategories.includes(v.category)).slice(0, 6) }))
    .filter((s) => s.items.length > 0);

  const openCategory = (cat) => {
    setSearchFilters((prev) => ({ ...prev, categories: cat.filterCategories }));
    navigation.navigate('Results', { categoryLabel: cat.label });
  };

  const openUsagePreset = (preset) => {
    setSearchFilters((prev) => ({
      ...prev,
      categories: preset.filterCategories,
      instantBookingOnly: Boolean(preset.instantBookingOnly),
    }));
    navigation.navigate('Results', { categoryLabel: preset.label });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Renault_Clio_V_1X7A0392.jpg' }}
          style={styles.hero}
          imageStyle={{ opacity: 0.35 }}
        >
          <View style={styles.heroOverlay}>
            <View style={styles.topBar}>
              <Pressable onPress={() => setMenuVisible(true)} hitSlop={8}>
                <Ionicons name="menu" size={26} color={colors.white} />
              </Pressable>
              <Image source={require('../../assets/logo-car-one-plus.png')} style={styles.logoSmall} resizeMode="contain" />
              <View style={styles.topBarIcons}>
                <Pressable onPress={() => navigation.navigate('Notifications')}><Ionicons name="notifications-outline" size={22} color={colors.white} /></Pressable>
                <Pressable onPress={() => navigation.navigate('AccountTab')}><Ionicons name="person-circle-outline" size={26} color={colors.white} /></Pressable>
              </View>
            </View>
            <Text style={styles.taglineSmall}>LOUEZ · VOYAGEZ · EXPLOREZ LE MONDE</Text>
            <Text style={styles.heroTitle}>Votre véhicule,{'\n'}<Text style={{ color: colors.gold }}>partout dans le monde</Text></Text>
            <Text style={styles.heroSubtitle}>Particuliers & Professionnels</Text>

            <View style={styles.rentalOptionsRow}>
              {RENTAL_OPTIONS.map((opt) => (
                <Pressable key={opt.id} style={styles.rentalOption} onPress={() => navigation.navigate('Search')}>
                  <Ionicons name={opt.icon} size={16} color={colors.textSecondary} />
                  <Text style={styles.rentalOptionLabel}>{opt.label}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable style={styles.searchBar} onPress={() => navigation.navigate('Search')}>
              <Ionicons name="location-outline" size={18} color={colors.textMuted} />
              <Text style={styles.searchPlaceholder}>{t('home.searchPlaceholder')}</Text>
              <View style={styles.searchIconWrap}><Ionicons name="search" size={18} color={colors.bg} /></View>
            </Pressable>
          </View>
        </ImageBackground>

        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={(c) => c.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
          renderItem={({ item }) => {
            const req = CATEGORY_REQUIREMENTS[item.filterCategories[0]];
            return (
              <CategoryChip
                icon={item.icon}
                label={item.label}
                comingSoon={req && !req.active}
                onPress={() => openCategory(item)}
              />
            );
          }}
        />

        <View style={styles.section}>
          <SectionHeader title="Selon votre besoin" />
          <Text style={styles.usageSubtitle}>Un catalogue assez large pour recommander le bon véhicule, pas juste le plus proche.</Text>
          <View style={styles.usageGrid}>
            {USAGE_PRESETS.map((preset) => (
              <Pressable key={preset.id} style={styles.usageCard} onPress={() => openUsagePreset(preset)}>
                <Ionicons name={preset.icon} size={20} color={colors.gold} />
                <Text style={styles.usageLabel}>{preset.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.promoBanner}>
          <Text style={styles.promoKicker}>RÉSERVEZ EN TOUTE CONFIANCE</Text>
          <Text style={styles.promoTitle}>Des véhicules haut de gamme pour tous vos trajets</Text>
          <View style={styles.promoBadges}>
            <View style={styles.promoBadge}><Ionicons name="shield-checkmark-outline" size={16} color={colors.gold} /><Text style={styles.promoBadgeText}>Assurance incluse</Text></View>
            <View style={styles.promoBadge}><Ionicons name="time-outline" size={16} color={colors.gold} /><Text style={styles.promoBadgeText}>Service 24/7</Text></View>
            <View style={styles.promoBadge}><Ionicons name="earth-outline" size={16} color={colors.gold} /><Text style={styles.promoBadgeText}>Monde entier</Text></View>
          </View>
          <Pressable style={styles.promoButton} onPress={() => navigation.navigate('Results', {})}>
            <Text style={styles.promoButtonText}>Voir toutes les catégories</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.bg} />
          </Pressable>
        </View>

        {categorySections.map(({ cat, items }) => (
          <View key={cat.id} style={styles.section}>
            <SectionHeader title={`${cat.label} populaires`} actionLabel={t('home.seeAll')} onAction={() => openCategory(cat)} />
            <FlatList
              horizontal
              data={items}
              keyExtractor={(v) => v.id}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              renderItem={({ item }) => (
                <VehicleCard vehicle={item} style={{ width: 220 }} onPress={() => navigation.navigate('VehicleDetail', { vehicleId: item.id })} />
              )}
            />
          </View>
        ))}

        <View style={[styles.section, styles.featureGrid]}>
          {FEATURES.map((f) => (
            <View key={f.titleKey} style={styles.featureCard}>
              <Ionicons name={f.icon} size={24} color={colors.gold} />
              <Text style={styles.featureTitle}>{t(f.titleKey)}</Text>
              <Text style={styles.featureBody}>{f.body}</Text>
            </View>
          ))}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>
      <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  hero: { backgroundColor: colors.bgElevated },
  heroOverlay: { backgroundColor: colors.overlay, paddingHorizontal: 20, paddingBottom: 24, paddingTop: 6 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  logoSmall: { width: 130, height: 40 },
  topBarIcons: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  taglineSmall: { color: colors.gold, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 10 },
  heroTitle: { ...typography.h1, fontSize: 26, lineHeight: 32 },
  heroSubtitle: { ...typography.bodyMuted, marginTop: 6, marginBottom: 14 },
  rentalOptionsRow: { flexDirection: 'row', gap: 18, marginBottom: 16, flexWrap: 'wrap' },
  rentalOption: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rentalOptionLabel: { ...typography.caption, color: colors.textSecondary },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: radii.pill, paddingLeft: 16, paddingRight: 4, height: 52, gap: 10, ...shadow },
  searchPlaceholder: { flex: 1, color: colors.textMuted, fontSize: 14 },
  searchIconWrap: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  chipsRow: { paddingHorizontal: 20, paddingVertical: 18, gap: 10 },
  promoBanner: { marginHorizontal: 20, backgroundColor: colors.card, borderRadius: radii.lg, padding: 18, borderWidth: 1, borderColor: colors.cardBorder, gap: 10 },
  promoKicker: { color: colors.gold, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  promoTitle: { ...typography.h2, fontSize: 18 },
  promoBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 4 },
  promoBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  promoBadgeText: { ...typography.caption, color: colors.textSecondary },
  promoButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.gold, borderRadius: radii.pill, height: 44, marginTop: 6 },
  promoButtonText: { color: colors.bg, fontWeight: '800', fontSize: 13 },
  section: { paddingHorizontal: 20, marginTop: 26 },
  usageSubtitle: { ...typography.caption, marginBottom: 14, marginTop: -6 },
  usageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  usageCard: { width: '31%', aspectRatio: 1, backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 8 },
  usageLabel: { ...typography.caption, textAlign: 'center', color: colors.textSecondary },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  featureCard: { width: '47%', backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14, gap: 6 },
  featureTitle: { ...typography.h3, fontSize: 14 },
  featureBody: { ...typography.caption },
});
