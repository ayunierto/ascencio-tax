import React, { useEffect, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';

import { useAuthStore } from '@/core/auth/store/useAuthStore';
import { verifyUserSchema } from '@/core/auth/schemas/verifyUserSchema';
import { useCanResendCode } from '@/core/auth/hooks/useCanResendCode';
import { resendCode } from '@/core/auth/actions/resend-code.action';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import ErrorMessage from '@/core/components/ErrorMessage';
import { ThemedText } from '@/components/ui/ThemedText';
import { theme } from '@/components/ui/theme';
import Alert from '@/components/ui/Alert';

const VerifyCode = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { action } = useLocalSearchParams();

  useEffect(() => {
    navigation.setOptions({
      title: 'Verify',
      headerTitleAlign: 'center',
      headerBackVisible: false,
    });
  }, []);

  const { user, verifyCode } = useAuthStore();

  const {
    timer,
    canResend,
    isLoadingResend,
    setIsLoadingResend,
    setTimer,
    setCanResend,
  } = useCanResendCode();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<z.infer<typeof verifyUserSchema>>({
    resolver: zodResolver(verifyUserSchema),
  });

  const onVerify = async ({
    verificationCode,
  }: z.infer<typeof verifyUserSchema>) => {
    if (user) {
      setIsLoading(true);
      const response = await verifyCode(user.email, verificationCode);
      setIsLoading(false);

      if ('statusCode' in response && response.statusCode === 401) {
        setValue('verificationCode', '');
        setError('root', {
          type: 'manual',
          message: `${response.message} . Please check your message or talk to an administrator`,
        });
        return;
      }

      if ('token' in response) {
        if (action === 'verify') {
          router.replace('/auth/sign-in');
          Toast.show({
            type: 'success',
            text1: `Please sign in`,
          });
          return;
        }

        if (action === 'reset-password') {
          router.push('/auth/new-password');
          return;
        }
      }

      router.replace('/auth/sign-in');
    }
    return;
  };

  const onResendCode = async () => {
    if (!canResend) return;
    setIsLoadingResend(true);
    const verificationPlatform = 'email';
    await resendCode(user!.email, verificationPlatform);
    Toast.show({
      type: 'success',
      text1: 'Code sent',
      text2: `Please check your ${verificationPlatform}`,
    });
    setIsLoadingResend(false);
    setTimer(30);
    setCanResend(false);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <KeyboardAvoidingView>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                flex: 1,
                gap: 10,
                maxWidth: 320,
                marginHorizontal: 'auto',
                padding: 20,
              }}
            >
              <ThemedText>
                We have sent an email verification to{' '}
                <ThemedText
                  style={{ color: theme.primary, fontWeight: 'bold' }}
                >
                  {user?.email}
                </ThemedText>{' '}
                with your code. Your code is 6 numbers long. Please check it,
                and stick it in the following text field
              </ThemedText>

              {errors.root?.message && (
                <Alert variant="error">{errors.root?.message}</Alert>
              )}

              <ThemedText>Code:</ThemedText>
              <Controller
                control={control}
                name="verificationCode"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="123456"
                    keyboardType="numeric"
                  />
                )}
              />
              <ErrorMessage fieldErrors={errors.verificationCode} />

              <Button
                disabled={isLoading}
                loading={isLoading}
                onPress={handleSubmit(onVerify)}
              >
                Verify
              </Button>
              <Button
                disabled={!canResend}
                loading={isLoadingResend}
                onPress={onResendCode}
                variant="outlined"
              >
                {canResend ? 'Resend code' : `Resend in ${timer}s`}
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerifyCode;
