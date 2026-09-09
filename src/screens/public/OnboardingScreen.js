import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import PrimaryButton from '../../components/PrimaryButton';

export default function OnboardingScreen({ navigation }) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);

  const slides = [
    { icon: 'car-sport', title: t('onboarding.slide1Title'), body: t('onboarding.slide1Body') },
    { icon: 'cash-outline', title: t('onboarding.slide2Title'), body: t('onboarding.slide2Body') },
    { icon: 'shield-checkmark', title: t('onboarding.slide3Title'), body: t('onboarding.slide3Body') },
  ];

  const goNext = () => {
    if (index < slides.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1 });
      setIndex(index + 1);
    } else {
      navigation.replace('AccountType');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.skipRow}>
        <Text onPress={() => navigation.replace('AccountType')} style={styles.skip}>{t('onboarding.skip')}</Text>
      </View>
      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.iconWrap}><Ionicons name={item.icon} size={48} color={colors.gold} /></View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
        )}
      />
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
      <View style={styles.footer}>
        <PrimaryButton label={index === slides.length - 1 ? t('onboarding.start') : t('onboarding.next')} onPress={goNext} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  skipRow: { alignItems: 'flex-end', paddingHorizontal: 20, paddingTop: 8 },
  skip: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36, gap: 16 },
  iconWrap: { width: 96, height: 96, borderRadius: radii.lg, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.h1, textAlign: 'center' },
  body: { ...typography.bodyMuted, textAlign: 'center', lineHeight: 21 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 12 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.cardBorder },
  dotActive: { backgroundColor: colors.gold, width: 20 },
  footer: { padding: 24 },
});
