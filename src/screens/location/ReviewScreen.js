import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { colors, typography, radii } from '../../theme/colors';
import PrimaryButton from '../../components/PrimaryButton';

export default function ReviewScreen({ navigation }) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}><Ionicons name="close" size={24} color={colors.white} /></Pressable>
        <Text style={styles.headerTitle}>{t('booking.review')}</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={{ padding: 20, gap: 20, alignItems: 'center' }}>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Pressable key={n} onPress={() => setRating(n)}>
              <Ionicons name={n <= rating ? 'star' : 'star-outline'} size={34} color={colors.gold} />
            </Pressable>
          ))}
        </View>
        <TextInput
          style={styles.textarea}
          placeholder="Partagez votre expérience..."
          placeholderTextColor={colors.textMuted}
          multiline
          value={comment}
          onChangeText={setComment}
        />
        <PrimaryButton label="Publier l'avis" onPress={() => navigation.goBack()} disabled={rating === 0} style={{ width: '100%' }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { ...typography.h3 },
  stars: { flexDirection: 'row', gap: 8 },
  textarea: { width: '100%', backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, padding: 14, color: colors.white, minHeight: 100, textAlignVertical: 'top' },
});
