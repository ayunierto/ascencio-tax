import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { z } from 'zod';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/presentation/theme/components/ui/Input';
import Button from '@/presentation/theme/components/ui/Button';
import Alert from '@/presentation/theme/components/ui/Alert';
import Header from '../../../../presentation/theme/components/auth/Header';
import { verifyUserSchema } from '@/core/auth/schemas/verifyUserSchema';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import Logo from '@/presentation/theme/components/Logo';

const verifyCode = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingResend, setIsLoadingResend] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const { user, verifyCode } = useAuthStore();

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<z.infer<typeof verifyUserSchema>>({
    resolver: zodResolver(verifyUserSchema),
    defaultValues: {
      verificationCode: '',
    },
  });

  const handleVerify = async ({
    verificationCode,
  }: z.infer<typeof verifyUserSchema>) => {
    if (user) {
      setIsLoading(true);
      const response = await verifyCode(user!.email, verificationCode);
      setIsLoading(false);

      if (response.token) {
        router.replace('/(tabs)/(home)');
      }

      if (response.statusCode === 401) {
        setError('verificationCode', {
          type: 'manual',
          message:
            response.message +
            '. Please check your message or talk to an administrator',
        });
        return;
      }
    }
    return;
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    setIsLoadingResend(true);
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL;
      const response = await fetch(`${API_URL}/auth/resend-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user?.email,
          verificationPlatform: 'email',
        }),
      }).then((data) => data.json());
      Toast.show({
        type: 'success',
        text1: 'Code sent',
        text2: 'Please check your email',
      });
      return response;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingResend(false);
      setTimer(30);
      setCanResend(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <KeyboardAvoidingView>
          <View
            style={{
              flex: 1,
              gap: 20,
              maxWidth: 320,
              marginHorizontal: 'auto',
            }}
          >
            <Logo />
            <Header title={'Verify'} subtitle={'Please verify your account'} />

            <Alert type="info">
              We have sent a verification code to your email. Please enter the
              code sent to verify your account.
            </Alert>
            <Controller
              control={control}
              name="verificationCode"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Verification code"
                  keyboardType="numeric"
                />
              )}
            />
            {errors.verificationCode && (
              <Text className="-mt-4 text-yellow-500 mb-5">
                {errors.verificationCode?.message as string}
              </Text>
            )}
            <Button
              disabled={!canResend}
              loading={isLoadingResend}
              onPress={handleResendCode}
              variant="secondary"
            >
              {canResend ? 'Resend code' : `Resend in ${timer}s`}
            </Button>
            <Button
              disabled={isLoading}
              loading={isLoadingResend}
              onPress={handleSubmit(handleVerify)}
            >
              Verify
            </Button>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default verifyCode;
