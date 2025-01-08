import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { router } from 'expo-router';

import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';

import { Input } from '@/presentation/theme/components/ui/Input';
import Button from '@/presentation/theme/components/ui/Button';
import Header from '../components/Header';
import { signinSchema } from '../../../core/auth/schemas/signinSchema';
import Toast from 'react-native-toast-message';

const Signin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userInactive, setUserInactive] = useState(false);
  const { signin, setUser } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const handleSignin = async (values: z.infer<typeof signinSchema>) => {
    setIsLoading(true);
    const response = await signin(values.username, values.password);
    setIsLoading(false);
    if (response.error === 'Unauthorized') {
      if (response.cause === 'verify') {
        setUserInactive(true);
        return;
      }
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: response.message,
      });
    }
    if (response.token) {
      router.replace('/');
    }
  };

  const handleVerifyAccount = async () => {
    setIsLoading(true);
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL;
      const response = await fetch(`${API_URL}/auth/resend-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: getValues('username'),
          verificationPlatform: 'email',
        }),
      }).then((data) => data.json());

      setUser({ email: getValues('username') });

      router.replace('/auth/verify');
      return response;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Code resent',
        text2: 'Please check your email',
      });
    }
  };

  return (
    <View className="flex justify-center gap-5">
      <Header
        subtitle=" Don’t have an account?"
        title={'Sign In'}
        link="/auth/signup"
        linkText="Sign Up"
      />

      {errors.root && (
        <Text className="-mt-4 text-yellow-400">
          {errors.root?.message as string}
        </Text>
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

      {errors.username && (
        <Text className="-mt-4 text-yellow-400">
          {errors.username?.message as string}
        </Text>
      )}

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

      {errors.password && (
        <Text className="-mt-4 text-yellow-400">
          {errors.password?.message as string}
        </Text>
      )}

      <Text
        className="text-blue-300 text-center"
        onPress={() => router.push('/auth/forgotPassword')}
      >
        Forgot password?
      </Text>

      {userInactive && (
        <>
          <Text className="-mt-4 text-yellow-400">
            Your account is inactive. Please contact support or verify your
            account.
          </Text>
          <Button onPress={() => handleVerifyAccount()} focusable>
            Verify account
          </Button>
        </>
      )}
      <Button
        loading={isLoading}
        disabled={isLoading}
        onPress={handleSubmit(handleSignin)}
        focusable
      >
        Log in
      </Button>
    </View>
  );
};

export default Signin;
