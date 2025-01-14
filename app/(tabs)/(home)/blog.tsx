import { View, Text } from 'react-native';
import React from 'react';
import { theme } from '@/presentation/theme/components/ui/Theme';

const Blog = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, color: theme.foreground }}>Blog</Text>
    </View>
  );
};

export default Blog;
