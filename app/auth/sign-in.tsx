import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { router } from 'expo-router';

import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/core/auth/store/useAuthStore';
import Toast from 'react-native-toast-message';

import { signinSchema } from '@/core/auth/schemas/signinSchema';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Logo from '@/components/Logo';
import ErrorMessage from '@/core/components/ErrorMessage';
import Alert from '@/components/ui/Alert';
import { theme } from '@/components/ui/theme';
import { ThemedText } from '@/components/ui/ThemedText';

const Signin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signin, setUser } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
  });

  const onSignin = async (values: z.infer<typeof signinSchema>) => {
    setIsLoading(true);
    const response = await signin(values);
    setIsLoading(false);

    if ('token' in response) {
      router.push('/(tabs)/(home)');
      Toast.show({ type: 'success', text1: `Welcome ${response.user.name}` });
      return;
    }

    if (response.message === 'User is not verified') {
      setUser({
        email: values.username,
        id: '',
        name: '',
        lastName: '',
        phoneNumber: '',
        birthdate: undefined,
        isActive: false,
        lastLogin: undefined,
        roles: [],
        createdAt: '',
        updatedAt: undefined,
      });
      router.push('/auth/verify');
      return;
    }

    setError('root', {
      type: 'manual',
      message:
        "We didn't recognize the username or password you entered. Please try again.",
    });

    Toast.show({
      type: 'error',
      text1: 'Invalid credentials',
    });
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <KeyboardAvoidingView>
          <Logo />
          <View
            style={{
              flex: 1,
              gap: 20,
              width: '100%',
              maxWidth: 300,
              marginHorizontal: 'auto',
              marginBottom: 20,
            }}
          >
            <View style={{ gap: 20 }}>
              <ThemedText style={{ fontSize: 35, textAlign: 'center' }}>
                Sign In
              </ThemedText>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  justifyContent: 'center',
                }}
              >
                <ThemedText style={{ fontSize: 16 }}>
                  Don’t have an account?
                </ThemedText>
                <ThemedText
                  onPress={() => router.push('/auth/sign-up')}
                  style={{
                    color: theme.primary,
                    textDecorationLine: 'underline',
                    fontSize: 16,
                  }}
                >
                  Sign Up
                </ThemedText>
              </View>
            </View>

            <View style={{ gap: 10 }}>
              {errors.root?.message && (
                <Alert variant="error">{errors.root?.message}</Alert>
              )}

              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    placeholder="Email or phone number"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                )}
              />
              <ErrorMessage fieldErrors={errors.username} />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    secureTextEntry={true}
                    placeholder="Enter password"
                    autoComplete="password"
                    autoCapitalize="none"
                  />
                )}
              />
              <ErrorMessage fieldErrors={errors.password} />
            </View>

            <Text
              className="text-blue-300 text-center"
              onPress={() => router.push('/auth/forgot-password')}
            >
              Forgot password?
            </Text>

            <Button
              loading={isLoading}
              disabled={isLoading}
              onPress={handleSubmit(onSignin)}
              focusable
            >
              Log In
            </Button>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signin;
