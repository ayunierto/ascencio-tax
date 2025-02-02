import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../Button';
import { theme } from '../Theme';
import { router } from 'expo-router';

const FloatingButtonGroup = () => {
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
        {/* <Button
          style={{
            width: 52,
            height: 52,
          }}
          onPress={() => {
            console.log('bag-add-outline');
          }}
        >
          <Ionicons name="bag-add-outline" size={20} color={theme.foreground} />
        </Button> */}

        <Button
          style={{
            width: 52,
            height: 52,
          }}
          onPress={() => {
            router.push('/(tabs)/receipts/receipts/add_expense');
          }}
        >
          <Ionicons name="receipt-outline" size={20} color={theme.foreground} />
        </Button>

        <Button
          style={{
            width: 52,
            height: 52,
          }}
          onPress={() => {
            console.log('camera-outline');
          }}
        >
          <Ionicons name="camera-outline" size={20} color={theme.foreground} />
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
        <Ionicons name="add" size={24} color="white" />
      </Button>
    </View>
  );
};

export default FloatingButtonGroup;
