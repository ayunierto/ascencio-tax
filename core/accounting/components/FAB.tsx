import React, { useState, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../../presentation/theme/components/ui/Button';
import { theme } from '../../../presentation/theme/components/ui/Theme';
import { router } from 'expo-router';
import { ThemedText } from '../../../presentation/theme/components/ui/ThemedText';

export const FAB = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleButtons = () => {
    setIsExpanded(!isExpanded);

    Animated.timing(animation, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      easing: Easing.out(Easing.quad), // Use a more natural easing
      useNativeDriver: true, // Important for performance
    }).start();
  };

  const translateY = animation.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1], // Adjust distance as needed
  });

  const opacity = animation.interpolate({
    inputRange: [0, 0.5, 1], // Fade in slightly later
    outputRange: [0, 0, 1],
  });

  // const rotate = animation.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ['0deg', '45deg'],
  // });

  return (
    <View
      style={{
        position: 'absolute',
        right: 20,
        bottom: 20,
        gap: 10,
        alignItems: 'center',
      }}
    >
      <Animated.View
        style={[
          { gap: 10 },
          {
            transform: [{ translateY }],
            opacity,
          },
        ]}
      >
        <Button
          style={{
            width: 52,
            height: 52,
          }}
          onPress={() => {
            router.push('/(tabs)/accounting/receipts/expense/create');
            toggleButtons();
          }}
        >
          <ThemedText>
            <Ionicons
              name="receipt-outline"
              size={20}
              color={theme.foreground}
            />
          </ThemedText>
        </Button>

        <Button
          style={{
            width: 52,
            height: 52,
          }}
          onPress={() => {
            router.push({
              pathname: '/scan-receipts',
              params: {
                generateBase64: 'yes',
              },
            });
            toggleButtons();
          }}
        >
          <ThemedText>
            <Ionicons
              name="camera-outline"
              size={20}
              color={theme.foreground}
            />
          </ThemedText>
        </Button>
      </Animated.View>

      <Button
        style={[
          {
            width: 56,
            height: 56,
          },
          // { transform: [{ rotate: '45deg' }] },
        ]}
        onPress={toggleButtons}
      >
        <ThemedText>
          <Ionicons name="add" size={24} color="white" />
        </ThemedText>
      </Button>
    </View>
  );
};
