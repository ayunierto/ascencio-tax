import { View, ActivityIndicator } from 'react-native';
import React from 'react';

const Loader = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="white" />
    </View>
  );
};

export default Loader;
