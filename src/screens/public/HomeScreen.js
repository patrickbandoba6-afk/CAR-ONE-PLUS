import React from 'react';
import { View, Text, Image, Pressable, ScrollView, TextInput, StyleSheet, ImageBackground, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii, shadow } from '../../theme/colors';
import { CATEGORIES } from '../../data/categories';
import { DEMO_VEHICLES } from '../../data/vehicles';
import { CATEGORY_REQUIREMENTS } from '../../data/categoryRequirements';
import CategoryChip from '../../components/CategoryChip';
import VehicleCard from '../../components/VehicleCard';
import SectionHeader from '../../components/SectionHeader';
import { useAppState } from '../../context/AppStateContext';

const FEATURES = [
  { icon: 'globe-outline', titleKey: 'home.trustBadges.global', bodyKey: null, body: 'Disponible dans plus de 180 pays' },
  { icon: 'diamond-outline', titleKey: 'home.trustBadges.pricing', body: 'Des prix transparents, sans frais cachés' },
  { icon: 'shield-checkmark-outline', titleKey: 'home.trustBadges.insurance', body: 'Roulez en toute sérénité' },
  { icon: 'headset-outline', titleKey: 'home.trustBadges.support', body: 'Toujours à votre écoute' },
];

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const { setSearchFilters } = useAppState();
  const popular = DEMO_VEHICLES.filter((v) => !v.premium).slice(0, 6);

  const openCategory = (cat) => {
    setSearchFilters((prev) => ({ ...prev, categories: cat.filterCategories }));
    navigation.navigate('Results', { categoryLabel: cat.label });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Renault_Clio_V_1X7A0392.jpg' }}
          style={styles.hero}
          imageStyle={{ opacity: 0.35 }}
        >
          <View style={styles.heroOverlay}>
            <View style={styles.topBar}>
              <Ionicons name="menu" size={26} color={colors.white} />
              <Image source={require('../../assets/logo-car-one-plus.png')} style={styles.logoSmall} resizeMode="contain" />
              <View style={styles.topBarIcons}>
                <Pressable onPress={() => navigation.navigate('Notifications')}><Ionicons name="notifications-outline" size={22} color={colors.white} /></Pressable>
                <Pressable onPress={() => navigation.navigate('AccountTab')}><Ionicons name="person-circle-outline" size={26} color={colors.white} /></Pressable>
              </View>
            </View>
            <Text style={styles.taglineSmall}>LOUEZ · VOYAGEZ · EXPLOREZ LE MONDE</Text>
            <Text style={styles.heroTitle}>Votre véhicule,{'\n'}<Text style={{ color: colors.gold }}>partout dans le monde</Text></Text>
            <Text style={styles.heroSubtitle}>Particuliers & Professionnels</Text>

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

        <View style={styles.section}>
          <SectionHeader title={t('home.popular')} actionLabel={t('home.seeAll')} onAction={() => navigation.navigate('Results', {})} />
          <FlatList
            horizontal
            data={popular}
            keyExtractor={(v) => v.id}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => (
              <VehicleCard vehicle={item} style={{ width: 220 }} onPress={() => navigation.navigate('VehicleDetail', { vehicleId: item.id })} />
            )}
          />
        </View>

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
  heroSubtitle: { ...typography.bodyMuted, marginTop: 6, marginBottom: 18 },
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
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  featureCard: { width: '47%', backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14, gap: 6 },
  featureTitle: { ...typography.h3, fontSize: 14 },
  featureBody: { ...typography.caption },
});
