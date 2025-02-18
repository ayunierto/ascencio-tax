import React from 'react';
import { theme } from '@/presentation/theme/components/ui/Theme';
import {
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ConfirmImageButtonProps {
  onPress: () => void;
}

export const ConfirmImageButton = ({ onPress }: ConfirmImageButtonProps) => {
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

const styles = StyleSheet.create({
  shutterButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
