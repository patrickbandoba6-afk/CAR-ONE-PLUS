import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme/colors';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Onboarding'), 1200);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo-car-one-plus.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.tagline}>Votre mobilité. Votre voiture. Votre revenu.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', gap: 16 },
  logo: { width: 220, height: 220 },
  tagline: { ...typography.bodyMuted, textAlign: 'center', paddingHorizontal: 32 },
});
