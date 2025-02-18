import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextProps,
  Text,
  TextStyle,
} from 'react-native';
import { theme } from '../Theme';

interface SimpleCardHeaderTitleProps extends TextProps {
  style?: StyleProp<TextStyle>;
}

export const SimpleCardHeaderTitle = ({
  style,
  children,
}: SimpleCardHeaderTitleProps) => {
  return <Text style={[styles.title, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.foreground,
  },
});
