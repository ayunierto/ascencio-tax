import { View, Text } from 'react-native';
import React from 'react';
import { Href, router } from 'expo-router';

interface HeaderProps {
  title: string;
  subtitle?: string;
  link?: Href;
  linkText?: string;
}

const Header = ({ link, linkText = '', subtitle, title }: HeaderProps) => {
  return (
    <View className="flex gap-5">
      <Text className="text-4xl color-white text-center">{title}</Text>
      <View className="flex flex-row gap-2 justify-center">
        {subtitle && <Text className="text-white">{subtitle}</Text>}
        {link && (
          <Text
            onPress={() => router.push(link)}
            className="text-blue-100 underline"
          >
            {linkText ? linkText : ''}
          </Text>
        )}
      </View>
    </View>
  );
};

export default Header;
