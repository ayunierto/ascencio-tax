import {
  StyleProp,
  Text,
  TouchableOpacity,
  ViewStyle,
  type TouchableOpacityProps,
} from 'react-native';
import React from 'react';
import { theme } from './Theme';
import { Ionicons } from '@expo/vector-icons';

interface ChipProps extends TouchableOpacityProps {
  text: string;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
}

const Chip = ({ text, icon, style, ...props }: ChipProps) => {
  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: theme.accent,
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: theme.radius,
          marginBottom: 10,
          alignSelf: 'flex-start',
        },
        style,
      ]}
      {...props}
    >
      {icon && <Ionicons name={icon} size={22} />}
      <Text>{text}</Text>
    </TouchableOpacity>
  );
};

export default Chip;
