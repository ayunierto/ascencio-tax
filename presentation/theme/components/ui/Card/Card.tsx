import React from 'react';
import {
  View,
  ViewProps,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { theme } from '../Theme';

interface SimpleCardProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
}

export const Card = ({ style, children, ...props }: SimpleCardProps) => {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderRadius: theme.radius,
    padding: 15,
    overflow: 'hidden',
  },
});
