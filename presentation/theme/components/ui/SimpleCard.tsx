import React from 'react';
import {
  View,
  Text,
  ViewProps,
  StyleProp,
  ViewStyle,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from './Theme';

interface CardProps extends ViewProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title?: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
}

const SimpleCard = ({ icon, title, subtitle, style, ...props }: CardProps) => {
  return (
    <View style={[styles.card, style]} {...props}>
      <Ionicons size={40} color={theme.foreground} name={icon} />
      <View style={{ width: 200 }}>
        <Text style={{ fontSize: 16, color: theme.foreground }}>{title}</Text>
        <Text
          style={{ color: theme.foreground }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {subtitle}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: theme.radius,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});

export default SimpleCard;
