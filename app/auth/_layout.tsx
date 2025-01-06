import { Slot } from 'expo-router';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  View,
  Image,
} from 'react-native';

export default function AuthLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <KeyboardAvoidingView>
          <View className="flex justify-center items-center">
            <View className="w-full max-w-96 p-5">
              <Image
                source={require('../../assets/images/logo.webp')}
                style={{
                  width: '100%',
                  height: 200,
                  resizeMode: 'contain',
                }}
              />
              <Slot />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}
