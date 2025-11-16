import { zodResolver } from '@hookform/resolvers/zod';
import { Redirect, router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { Button, ButtonText } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthFormContainer } from '@/core/auth/components/AuthFormContainer';
import { ErrorBox } from '@/core/auth/components/ErrorBox';
import Header from '@/core/auth/components/Header';
import {
    useResendResetPasswordMutation,
    useResetPasswordMutation,
    useTimer,
} from '@/core/auth/hooks';
import {
    ResetPasswordRequest,
    resetPasswordSchema,
} from '@/core/auth/schemas/reset-password.schema';
import { useAuthStore } from '@/core/auth/store/useAuthStore';
import { authStyles } from '@/core/auth/styles/authStyles';

const VerifyCode = () => {
  const { user, tempEmail } = useAuthStore();
  const { isRunning, timeRemaining, startTimer, resetTimer } = useTimer(30);
  
  const newPasswordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResetPasswordRequest>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    startTimer();
    setValue('email', tempEmail || '');

    return () => {
      resetTimer();
    };
  }, [resetTimer, setValue, startTimer, tempEmail]);

  const { mutate: verifyEmail, isPending } = useResetPasswordMutation();
  const { mutate: resendResetPasswordCode } = useResendResetPasswordMutation();

  if (!tempEmail) {
    return <Redirect href={'/auth/sign-in'} />;
  }

  const handleEmailVerification = useCallback((data: ResetPasswordRequest) => {
    verifyEmail(data, {
      onSuccess: (data) => {
        Toast.show({
          type: 'success',
          text1: 'Password Reset Successfully',
          text2: data.message,
        });
        router.replace('/auth/sign-in');
      },
      onError: (error) => {
        Toast.show({
          type: 'error',
          text1: 'Password Reset Error',
          text2: error.response?.data.message || error.message,
        });
      },
    });
    resetTimer();
    startTimer();
  }, [verifyEmail, resetTimer, startTimer]);

  const handleResendPasswordCode = useCallback(() => {
    if (isRunning) return;
    resendResetPasswordCode(user?.email || '');
    startTimer();
  }, [isRunning, resendResetPasswordCode, user?.email, startTimer]);

  const submitButtonText = useMemo(
    () => (isPending ? 'Verifying...' : 'Verify'),
    [isPending]
  );

  const resendButtonText = useMemo(
    () => (timeRemaining === 0 ? 'Resend code' : `Resend in ${timeRemaining}s`),
    [timeRemaining]
  );

  return (
    <AuthFormContainer maxWidth={320}>
      <Header
        title={'Change your password'}
        subtitle={
          'Please check your email for a message with your code. Your code is 6 numbers long.'
        }
      />

      <View style={authStyles.fieldsContainer}>
        <ErrorBox message={errors.root?.message} />

        <Controller
          control={control}
          name="code"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Code"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="123456"
              keyboardType="numeric"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              maxLength={6}
              returnKeyType="next"
              onSubmitEditing={() => newPasswordRef.current?.focus()}
              blurOnSubmit={false}
              error={!!errors.code}
              errorMessage={errors.code?.message || ''}
            />
          )}
        />

        <Controller
          control={control}
          name="newPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              ref={newPasswordRef}
              label="New Password"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="New Password"
              keyboardType="default"
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleSubmit(handleEmailVerification)}
              error={!!errors.newPassword}
              errorMessage={errors.newPassword?.message || ''}
              secureTextEntry
            />
          )}
        />
      </View>

      <View style={authStyles.buttonGroup}>
        <Button
          disabled={isPending}
          onPress={handleSubmit(handleEmailVerification)}
          isLoading={isPending}
        >
          <ButtonText>{submitButtonText}</ButtonText>
        </Button>

        <Button
          disabled={isPending || isRunning}
          onPress={handleResendPasswordCode}
          variant="outline"
        >
          <ButtonText>{resendButtonText}</ButtonText>
        </Button>
      </View>
    </AuthFormContainer>
  );
};

export default VerifyCode;
