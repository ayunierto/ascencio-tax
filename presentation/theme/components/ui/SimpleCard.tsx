import React from 'react';
import {
  View,
  Text,
  ViewProps,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from './Theme';

interface SimpleCardProps extends ViewProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title?: string;
  subtitle?: string;
  text?: string;
  style?: StyleProp<ViewStyle>;
}

const SimpleCard = ({
  icon,
  title,
  subtitle,
  text,
  style,
  children,
  ...props
}: SimpleCardProps) => {
  return (
    <View style={[styles.card, style]} {...props}>
      <Ionicons size={40} color={theme.foreground} name={icon} />
      <View
        style={{
          flex: 1,
        }}
      >
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 18, color: theme.foreground }}>{title}</Text>
          <Text
            style={{ color: theme.mutedForeground, fontSize: 12 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {subtitle}
          </Text>
        </View>
        {text ? (
          <Text
            style={{ color: theme.foreground, marginTop: 10 }}
            numberOfLines={10}
            ellipsizeMode="tail"
          >
            {text}
          </Text>
        ) : (
          children
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
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
