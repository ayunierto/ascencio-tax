import React from 'react';
import {
  Pressable,
  type PressableProps,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { theme } from './Theme';
import { Feather } from '@expo/vector-icons';

interface ButtonProps extends PressableProps {
  onPress?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  loading?: boolean;
}

export const Button = ({
  onPress,
  disabled,
  children,
  loading,
  style,
  ...rest
}: ButtonProps) => {
  const primaryColor = theme.primary || 'blue';

  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? primaryColor + '90' : primaryColor,
        },
        { backgroundColor: disabled ? primaryColor + '70' : primaryColor },
        styles.button,
      ]}
      onPress={disabled || loading ? () => {} : onPress}
      {...rest}
    >
      {loading ? (
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Feather name="loader" size={24} color="black" />
          <Text style={[styles.buttonText]}>Loading</Text>
        </View>
      ) : (
        <Text style={[styles.buttonText]}>{children}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default Button;
