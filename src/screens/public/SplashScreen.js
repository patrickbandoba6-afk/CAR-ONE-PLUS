import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, StyleSheet } from 'react-native';
import { colors, typography, radii } from '../../theme/colors';
import { LEGAL_ENTITY } from '../../data/legalEntity';

const SPLASH_DURATION_MS = 6000;

export default function SplashScreen({ navigation }) {
  const progress = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    Animated.timing(progress, { toValue: 1, duration: SPLASH_DURATION_MS, useNativeDriver: false }).start();
    const timer = setTimeout(() => navigation.replace('Onboarding'), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fade }]}>
        <Image source={require('../../assets/logo-car-one-plus.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.kicker}>LOUEZ · VOYAGEZ · EXPLOREZ LE MONDE</Text>
        <Text style={styles.tagline}>{LEGAL_ENTITY.tagline}</Text>
        <Text style={styles.legal}>{LEGAL_ENTITY.legalMention}</Text>
      </Animated.View>
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressFill,
            { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 },
  content: { alignItems: 'center', gap: 14 },
  logo: { width: 260, height: 260 },
  kicker: { color: colors.gold, fontSize: 11, fontWeight: '700', letterSpacing: 1.8 },
  tagline: { ...typography.bodyMuted, textAlign: 'center', paddingHorizontal: 32 },
  legal: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  progressTrack: { position: 'absolute', bottom: 56, width: 160, height: 3, borderRadius: radii.sm, backgroundColor: colors.cardBorder, overflow: 'hidden' },
  progressFill: { height: 3, backgroundColor: colors.gold },
});
