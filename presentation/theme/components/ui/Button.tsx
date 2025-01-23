import React, { useEffect, useRef, useState } from 'react';
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
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;

  textStyle?: TextStyle;
  containerTextAndIconsStyle?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'secondary' | 'destructive' | 'outlined' | 'ghost';
  size?: 'small' | 'medium' | 'large';
}

export const Button = ({
  children,
  disabled,
  iconLeft,
  iconRight,
  loading,
  onPress,
  style,
  textStyle,
  containerTextAndIconsStyle,
  variant = 'primary',
  size = 'medium',
  ...props
}: ButtonProps) => {
  const [pressed, setPressed] = useState(false);

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
        pressed && styles.disabled,
        style,
      ]}
      onPressIn={() => {
        setPressed(true);
      }}
      onPressOut={() => {
        setPressed(false);
      }}
      {...props}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={
              variant === 'outlined'
                ? theme.foreground
                : theme.primaryForeground
            }
          />
          <Text
            style={[styles.buttonText, variantTextStyles[variant], textStyle]}
          >
            Please wait ...
          </Text>
        </View>
      ) : (
        <View
          style={[
            {
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              justifyContent: 'center',
            },
            containerTextAndIconsStyle,
          ]}
        >
          {iconLeft && iconLeft}
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
          {iconRight && iconRight}
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
