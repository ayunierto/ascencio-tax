import React from 'react';
import {
  Pressable,
  type PressableProps,
  Text,
  TextStyle,
  View,
} from 'react-native';
import { theme } from './Theme';
import { AntDesign, Feather } from '@expo/vector-icons';

interface ButtonProps extends PressableProps {
  onPress?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  loading?: boolean;
  textStyle?: TextStyle;
  className?: string;
  textClassName?: string;
  icon?: React.ReactNode;
}

export const Button = ({
  onPress,
  disabled,
  children,
  loading,
  textStyle,
  className,
  textClassName,
  //
  icon,
  ...rest
}: ButtonProps) => {
  return (
    <Pressable
      onPress={disabled || loading ? () => {} : onPress}
      {...rest}
      className={`bg-white rounded-full px-4 h-11 flex items-center justify-center ${
        disabled && 'opacity-60'
      } ${className}`}
    >
      {loading ? (
        <View className="flex-row gap-2 justify-center items-center">
          <AntDesign
            name="loading1"
            size={24}
            color="black"
            className="animate-spin"
          />
          <Text
            style={textStyle}
            className={` ${disabled && 'text-gray-500'} ${textClassName}`}
          >
            Loading
          </Text>
        </View>
      ) : (
        <View className="flex-row gap-2 justify-center items-center">
          {icon && icon}
          <Text
            style={textStyle}
            className={` ${disabled && 'text-gray-500'} ${textClassName}`}
          >
            {children}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

export default Button;
