import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export async function pickImageFromGallery(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert(
      'Permissão necessária',
      'Precisamos de acesso às suas fotos para você escolher a imagem da peça.'
    );
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });

  if (!result.canceled && result.assets[0]?.uri) {
    return result.assets[0].uri;
  }

  return null;
}

export async function takePhotoWithCamera(): Promise<string | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert(
      'Permissão necessária',
      'Precisamos de acesso à sua câmera para você fotografar a peça.'
    );
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });

  if (!result.canceled && result.assets[0]?.uri) {
    return result.assets[0].uri;
  }

  return null;
}