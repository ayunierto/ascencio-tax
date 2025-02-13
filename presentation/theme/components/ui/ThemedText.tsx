import {
  View,
  Text as NativeText,
  StyleProp,
  TextStyle,
  TextProps,
} from 'react-native';
import React from 'react';
import { theme } from './Theme';

interface CustomTextProps extends TextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}
const ThemedText = ({ children, style, ...props }: CustomTextProps) => {
  return (
    <NativeText style={[{ color: theme.foreground }, style]} {...props}>
      {children}
    </NativeText>
  );
};

export { ThemedText };
