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
import Header from '../../../../presentation/theme/components/auth/Header';
import { verifyUserSchema } from '@/core/auth/schemas/verifyUserSchema';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useCanResendCode } from '@/core/auth/hooks/useCanResendCode';
import { resendCode } from '@/core/auth/actions/resend-code';

const VerifyCode = () => {
  const [isLoading, setIsLoading] = useState(false);

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
    const response = await resendCode(user!.email, 'email');
    console.log(response);
    Toast.show({
      type: 'success',
      text1: 'Code sent',
      text2: 'Please check your email',
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
              gap: 20,
              maxWidth: 320,
              marginHorizontal: 'auto',
            }}
          >
            <Header
              title={'Verify'}
              subtitle={
                'Please check your email for a message with your code. Your code is 6 numbers long.'
              }
            />

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
              disabled={isLoading}
              loading={isLoading}
              onPress={handleSubmit(handleVerify)}
            >
              Verify
            </Button>
            <Button
              disabled={!canResend}
              loading={isLoadingResend}
              onPress={handleResendCode}
              variant="outlined"
            >
              {canResend ? 'Resend code' : `Resend in ${timer}s`}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerifyCode;
