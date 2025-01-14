import React, { useEffect, useRef } from 'react';
import {
  Pressable,
  type PressableProps,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
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
  size?: 'small' | 'medium' | 'large';
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
  size = 'medium',
  ...rest
}: ButtonProps) => {
  const variantStyles = {
    primary: styles.primary,
    secondary: styles.secondary,
    destructive: styles.destructive,
    outlined: styles.outlined,
    ghost: styles.ghost,
  };

  const sizeStyles = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
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
        styles.button,
        variantStyles[variant],
        sizeStyles[size],
        disabled && styles.disabled,
        loading && styles.disabled,
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
          <Text
            style={[styles.buttonText, variantTextStyles[variant], textStyle]}
          >
            Please wait ...
          </Text>
        </View>
      ) : (
        <View className="flex-row gap-2 justify-center items-center">
          {icon && icon}
          <Text
            style={[
              styles.buttonText,
              variantTextStyles[variant],
              disabled && styles.disabledText,
              ,
              textStyle,
            ]}
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
  small: {
    height: 32,
  },
  medium: {
    height: 48,
  },
  large: {
    height: 56,
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
    color: '#888',
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
