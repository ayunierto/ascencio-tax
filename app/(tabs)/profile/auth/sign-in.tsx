import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { router } from 'expo-router';
import * as Localization from 'expo-localization';

import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';

import { Input } from '@/presentation/theme/components/ui/Input';
import Button from '@/presentation/theme/components/ui/Button';
import Header from '../../../../presentation/theme/components/auth/Header';
import Toast from 'react-native-toast-message';
import { signinSchema } from '@/core/auth/schemas/signinSchema';
import Logo from '@/presentation/theme/components/Logo';
import { useCanResendCode } from '@/core/auth/hooks/useCanResendCode';
import { resendCode } from '@/core/auth/actions/resend-code';

const Signin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userInactive, setUserInactive] = useState(false);
  const { signin, setUser } = useAuthStore();

  const {
    canResend,
    isLoadingResend,
    setCanResend,
    setIsLoadingResend,
    setTimer,
    timer,
  } = useCanResendCode();
  // const [screenDimensions, setScreenDimensions] = useState(
  //   Dimensions.get('window')
  // );

  // useEffect(() => {
  //   const subscription = Dimensions.addEventListener('change', ({ window }) => {
  //     setScreenDimensions(window);
  //   });
  //   console.log(screenDimensions);
  //   return () => subscription?.remove();
  // }, []);

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
      }
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: response.message,
      });

      if (response.cause === 'inactive') {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.message,
        });
      }
      return;
    }

    if (response.token) {
      router.push('/(tabs)/(home)');
    }
  };

  const handleVerifyAccount = async () => {
    setIsLoadingResend(true);
    const response = await resendCode(getValues('username'), 'email');
    setIsLoadingResend(false);

    setUser({ email: getValues('username') });

    router.push('/(tabs)/profile/auth/verify');
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
              maxWidth: 320,
              marginHorizontal: 'auto',
              marginBottom: 20,
            }}
          >
            <Header
              subtitle=" Don’t have an account?"
              title={'Sign In'}
              link="/(tabs)/profile/auth/sign-up"
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

            {userInactive && (
              <>
                <Text className="-mt-4 text-yellow-400">
                  Your account is inactive. Please contact support or verify
                  your account.
                </Text>
                <Button
                  variant="secondary"
                  loading={isLoadingResend}
                  disabled={isLoadingResend}
                  onPress={() => handleVerifyAccount()}
                >
                  Verify account
                </Button>
              </>
            )}
            <Text
              className="text-blue-300 text-center"
              onPress={() =>
                router.push('/(tabs)/profile/auth/forgot-password')
              }
            >
              Forgot password?
            </Text>

            <Button
              loading={isLoading}
              disabled={isLoading}
              onPress={handleSubmit(handleSignin)}
              focusable
            >
              Log In
            </Button>
            <Text style={{ color: 'white' }}>
              {/* La moneda del usuario es: {deviceLanguage} */}
            </Text>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signin;
