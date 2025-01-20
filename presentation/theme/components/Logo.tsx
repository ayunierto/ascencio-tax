import { Image, View } from 'react-native';
import React from 'react';

const Logo = () => {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={require('../../../assets/images/logo.png')}
        style={{
          width: '80%',
          maxWidth: 300,
          resizeMode: 'contain',
          height: 200,
        }}
      />
    </View>
  );
};

export default Logo;
