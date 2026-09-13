import React, { useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, PanResponder } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, typography } from '../theme/colors';

// Signature manuscrite capturée au doigt — un trait par geste, stocké comme
// une liste de chemins SVG (pas de librairie tierce : react-native-svg est
// déjà une dépendance du projet). Réutilisé à l'inscription (KYC) et sur les
// contrats de location.
export default function SignaturePad({ value, onChange, height = 160 }) {
  const [strokes, setStrokes] = useState(value || []);
  const [activeStroke, setActiveStroke] = useState('');

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setActiveStroke(`M${locationX.toFixed(1)},${locationY.toFixed(1)}`);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setActiveStroke((prev) => `${prev} L${locationX.toFixed(1)},${locationY.toFixed(1)}`);
      },
      onPanResponderRelease: () => {
        setActiveStroke((prev) => {
          if (!prev) return prev;
          setStrokes((s) => {
            const next = [...s, prev];
            onChange?.(next);
            return next;
          });
          return '';
        });
      },
    })
  ).current;

  const clear = () => {
    setStrokes([]);
    setActiveStroke('');
    onChange?.([]);
  };

  const isEmpty = strokes.length === 0 && !activeStroke;

  return (
    <View>
      <View style={[styles.pad, { height }]} {...panResponder.panHandlers}>
        <Svg width="100%" height="100%">
          {strokes.map((d, i) => (
            <Path key={i} d={d} stroke={colors.white} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          ))}
          {activeStroke ? (
            <Path d={activeStroke} stroke={colors.white} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          ) : null}
        </Svg>
        {isEmpty && <Text style={styles.hint}>Signez ici avec le doigt</Text>}
        <View style={styles.baseline} />
      </View>
      {!isEmpty && (
        <Pressable onPress={clear} style={styles.clearBtn}>
          <Text style={styles.clearText}>Effacer</Text>
        </Pressable>
      )}
    </View>
  );
}

// Rendu statique d'une signature déjà enregistrée (contrat, récapitulatif KYC).
export function SignaturePreview({ value, height = 70 }) {
  if (!value?.length) return null;
  return (
    <View style={[styles.preview, { height }]}>
      <Svg width="100%" height="100%">
        {value.map((d, i) => (
          <Path key={i} d={d} stroke={colors.white} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: { backgroundColor: colors.card, borderRadius: radii.md, borderWidth: 1, borderColor: colors.cardBorder, borderStyle: 'dashed', overflow: 'hidden', justifyContent: 'center' },
  hint: { ...typography.caption, textAlign: 'center' },
  baseline: { position: 'absolute', left: 20, right: 20, bottom: 28, height: 1, backgroundColor: colors.cardBorder },
  clearBtn: { alignSelf: 'flex-end', marginTop: 8 },
  clearText: { color: colors.gold, fontWeight: '700', fontSize: 13 },
  preview: { backgroundColor: colors.bgElevated, borderRadius: radii.sm },
});
