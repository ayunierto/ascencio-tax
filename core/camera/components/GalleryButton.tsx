import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

interface GalleryButtonProps {
  onPress: () => void;
}

export const GalleryButton = ({ onPress }: GalleryButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: 50,
        height: 50,
        borderRadius: 9999,
        backgroundColor: '#17202A',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Ionicons name="image-outline" size={30} color={'white'} />
    </TouchableOpacity>
  );
};
