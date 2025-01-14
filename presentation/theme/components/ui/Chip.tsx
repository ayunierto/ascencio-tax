import {
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from 'react-native';
import React from 'react';
import { theme } from './Theme';
import { Ionicons } from '@expo/vector-icons';

interface ChipProps extends TouchableOpacityProps {
  text: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  className?: string;
  classNameText?: string;
}

const Chip = ({
  text,
  icon,
  style,
  className,
  classNameText,
  color,
  ...props
}: ChipProps) => {
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
      className={className}
      {...props}
    >
      {icon && <Ionicons color={color || 'black'} name={icon} size={22} />}
      <Text className={`${classNameText}`} style={{ color: color || 'black' }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default Chip;
