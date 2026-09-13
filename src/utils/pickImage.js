import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

// Ouvre vraiment la galerie de l'appareil (ou le sélecteur de fichier sur web)
// et retourne l'URI de l'image choisie, ou null si annulé/refusé.
export async function pickImage() {
  if (Platform.OS !== 'web') {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return null;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.7,
  });
  if (result.canceled || !result.assets?.length) return null;
  return result.assets[0].uri;
}
