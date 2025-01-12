import React, { useEffect, useRef } from 'react';
import {
  Pressable,
  type PressableProps,
  PressableStateCallbackType,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { theme } from './Theme';

interface ButtonProps extends PressableProps {
  children?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;

  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'destructive' | 'outlined' | 'ghost';
}

export const Button = ({
  children,
  disabled,
  icon,
  loading,
  onPress,
  style,
  textStyle,
  variant = 'primary',
  ...rest
}: ButtonProps) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true, // Important for performance
      })
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const variantStyles = {
    primary: styles.primary,
    secondary: styles.secondary,
    destructive: styles.destructive,
    outlined: styles.outlined,
    ghost: styles.ghost,
  };

  const variantTextStyles = {
    primary: styles.textPrimary,
    secondary: styles.textSecondary,
    destructive: styles.textDestructive,
    outlined: styles.textOutlined,
    ghost: styles.textGhost,
  };

  return (
    <Pressable
      onPress={disabled || loading ? () => {} : onPress}
      style={[
        styles.button, // base styles
        variantStyles[variant],
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={variant === 'outlined' ? 'blue' : 'white'}
          />
          <Text style={[styles.buttonText, styles.disabledText, textStyle]}>
            Please wait ...{' '}
          </Text>
        </View>
      ) : (
        <View className="flex-row gap-2 justify-center items-center">
          {icon && icon}
          <Text
            style={[styles.buttonText, variantTextStyles[variant], textStyle]}
          >
            {children}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.radius,
    paddingHorizontal: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  primary: {
    backgroundColor: theme.primary,
  },
  secondary: {
    backgroundColor: theme.secondary,
  },
  destructive: {
    backgroundColor: theme.destructive,
  },
  outlined: {
    borderColor: theme.primary,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  textPrimary: {
    color: theme.primaryForeground,
  },
  textSecondary: {
    color: theme.secondaryForeground,
  },
  textDestructive: {
    color: theme.destructiveForeground,
  },
  textOutlined: {
    color: theme.primaryForeground,
  },
  textGhost: {
    color: theme.primaryForeground,
  },
  disabledText: {
    color: '#cccccc',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8, // Adjust spacing as needed
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});

export default Button;
