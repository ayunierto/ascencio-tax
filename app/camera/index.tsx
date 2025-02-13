import { useEffect, useRef, useState } from 'react';
import { router, useNavigation } from 'expo-router';
import {
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

import { useCameraStore } from '../../core/camera/store/useCameraStore';
import Button from '@/presentation/theme/components/ui/Button';
import { theme } from '@/presentation/theme/components/ui/Theme';
import { ThemedText } from '@/presentation/theme/components/ui/ThemedText';

export default function App() {
  const { addSelectedImage, clearImages } = useCameraStore();

  const [facing, setFacing] = useState<CameraType>('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermissionResponse, requestMediaPermission] =
    MediaLibrary.usePermissions();

  const [selectedImage, setSelectedImage] = useState<string>();
  const cameraRef = useRef<CameraView>(null);

  const onRequestPermissions = async () => {
    try {
      const { status: cameraPermissionStatus } =
        await requestCameraPermission();

      if (cameraPermissionStatus !== 'granted') {
        Alert.alert('Error', 'Camera permission not granted');
        return;
      }
      const { status: mediaPermissionStatus } = await requestMediaPermission();
      if (mediaPermissionStatus !== 'granted') {
        Alert.alert('Error', 'Gallery permission not granted');
        return;
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Permits could not be obtained');
    }
  };

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  if (!cameraPermission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!cameraPermission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={{ ...styles.container, padding: 20 }}>
        <ThemedText style={styles.message}>
          We need your permission to show the camera and gallery
        </ThemedText>
        <Button onPress={onRequestPermissions}>Grant permission</Button>
      </View>
    );
  }

  const onShutterButtonPress = async () => {
    if (!cameraRef.current) return;

    const picture = await cameraRef.current.takePictureAsync({
      quality: 1,
    });

    if (!picture?.uri) return;

    setSelectedImage(picture.uri);

    // TODO: Save Image
  };

  const onReturnCancel = () => {
    // TODO: Clean state
    router.dismiss();
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  const onPictureConfirm = async () => {
    // TODO: Implement
    if (!selectedImage) return;
    await MediaLibrary.createAssetAsync(selectedImage);
    addSelectedImage(selectedImage);
    router.dismiss();
  };

  const onRetakePicture = () => {
    setSelectedImage(undefined);
  };

  const onPickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) return;

    clearImages();
    result.assets.map((img) => addSelectedImage(img.uri));

    router.dismiss();
  };

  if (selectedImage) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: selectedImage }} style={styles.camera} />
        <ConfirmImageButton onPress={onPictureConfirm} />
        <RetakeImageButton onPress={onRetakePicture} />
        <ReturnCancelButton onPress={onReturnCancel} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <ShutterButton onPress={onShutterButtonPress} />
        <GalleryButton onPress={onPickImages} />
        <FlipCameraButton onPress={toggleCameraFacing} />
        <ReturnCancelButton onPress={onReturnCancel} />
      </CameraView>
    </View>
  );
}

const ShutterButton = ({ onPress = () => {} }) => {
  const dimensions = useWindowDimensions();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.shutterButton,
        {
          position: 'absolute',
          bottom: 30,
          left: dimensions.width / 2 - 32,
          borderColor: theme.primary,
        },
      ]}
    ></TouchableOpacity>
  );
};

const GalleryButton = ({ onPress = () => {} }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.galleryButton}>
      <Ionicons name="image-outline" size={30} color={'white'} />
    </TouchableOpacity>
  );
};

const FlipCameraButton = ({ onPress = () => {} }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.flipCameraButton}>
      <Ionicons name="camera-reverse-outline" size={30} color={'white'} />
    </TouchableOpacity>
  );
};

const ReturnCancelButton = ({ onPress = () => {} }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.returnCancelButton}>
      <Ionicons name="arrow-back-outline" size={30} color={'white'} />
    </TouchableOpacity>
  );
};

const ConfirmImageButton = ({ onPress = () => {} }) => {
  const dimensions = useWindowDimensions();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.shutterButton,
        {
          position: 'absolute',
          bottom: 30,
          left: dimensions.width / 2 - 32,
          borderColor: theme.primary,
        },
      ]}
    >
      <Ionicons name="checkmark-outline" size={30} color={theme.primary} />
    </TouchableOpacity>
  );
};

const RetakeImageButton = ({ onPress = () => {} }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.flipCameraButton}>
      <Ionicons name="close-outline" size={30} color={'white'} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },

  shutterButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  flipCameraButton: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: '#17202A',
    position: 'absolute',
    bottom: 40,
    right: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: '#17202A',
    position: 'absolute',
    bottom: 40,
    left: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  returnCancelButton: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: '#17202A',
    position: 'absolute',
    top: 40,
    left: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
