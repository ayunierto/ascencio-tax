import { View, ActivityIndicator, StyleSheet } from 'react-native';
import React from 'react';
import { theme } from './ui/Theme';

const Loader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={theme.foreground} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loader;
