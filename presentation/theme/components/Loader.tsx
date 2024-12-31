import { View, Text, ActivityIndicator } from 'react-native';
import React from 'react';

const Loader = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator />
    </View>
  );
};

export default Loader;
