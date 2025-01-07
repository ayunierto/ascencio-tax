import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { z } from 'zod';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/presentation/theme/components/ui/Input';
import Button from '@/presentation/theme/components/ui/Button';
import Header from '../components/Header';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { changePassword } from '../../../core/auth/actions/changePassword';

export const newPasswordSchema = z.object({
  password: z
    .string()
    .regex(
      /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      'The password must have a Uppercase, lowercase letter and a number'
    ),
});

const newPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { changePassword } = useAuthStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const handleChangePassword = async ({
    password,
  }: z.infer<typeof newPasswordSchema>) => {
    setIsLoading(true);
    const response = await changePassword(password);
    setIsLoading(false);

    if (response.token) {
      router.replace('/(ascenciotax-app)/(home)');
      Toast.show({
        type: 'success',
        text1: 'Password changed successfully',
      });
    }

    if (response.statusCode === 401) {
      setError('password', {
        type: 'manual',
        message:
          response.message +
          '. Please check your message or talk to an administrator',
      });
      return;
    }
    return;
  };

  return (
    <View className="flex justify-center gap-5">
      <Header
        title="Choose a new password"
        subtitle={
          'Create a new password that is at least 6 characters long. A strong password is combination of letters, numbers, and punctuation marks.'
        }
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="New Password"
            autoCapitalize="none"
          />
        )}
      />
      {errors.password && (
        <Text className="-mt-4 text-yellow-500 mb-5">
          {errors.password?.message as string}
        </Text>
      )}
      <Button
        disabled={isLoading}
        loading={isLoading}
        onPress={handleSubmit(handleChangePassword)}
      >
        Change Password
      </Button>
    </View>
  );
};

export default newPassword;
