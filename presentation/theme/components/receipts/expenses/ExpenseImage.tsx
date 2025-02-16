import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { ThemedText } from '../../ui/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../ui/Theme';
import { router } from 'expo-router';
import { useCameraStore } from '@/core/camera/store';

interface ExpenseImageProps {
  image: string | null;
  onChange?: (image: string | undefined) => void;
}

const ExpenseImage = ({ image, onChange }: ExpenseImageProps) => {
  const { selectedImages, clearImages } = useCameraStore();

  useEffect(() => {
    onChange && onChange(selectedImages[0]);
  }, [selectedImages]);

  const removeImage = () => {
    clearImages();

    onChange && onChange(undefined);
  };

  return (
    <View style={styles.imageContainer}>
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {image ? (
          <View>
            <Image
              source={{ uri: image }}
              style={{
                width: 50,
                height: 50,
                borderRadius: theme.radius,
                marginTop: 10,
              }}
            />
            <TouchableOpacity
              style={{
                backgroundColor: theme.muted,
                position: 'absolute',
                borderRadius: theme.radius,
                padding: 4,
                right: 0,
              }}
              onPress={() => removeImage()}
            >
              <Ionicons name="close-outline" />
            </TouchableOpacity>
          </View>
        ) : (
          <ThemedText>No images found</ThemedText>
        )}
        <TouchableOpacity onPress={() => router.push('/camera')}>
          <Ionicons
            name="camera-outline"
            color={theme.foreground}
            size={24}
            style={{
              backgroundColor: theme.mutedForeground,
              borderRadius: theme.radius,
              padding: 8,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    borderColor: theme.foreground,
    borderWidth: 1,
    borderRadius: theme.radius,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default ExpenseImage;
