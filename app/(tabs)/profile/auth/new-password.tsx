import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { z } from 'zod';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/presentation/theme/components/ui/Input';
import Button from '@/presentation/theme/components/ui/Button';
import Header from '../../../../presentation/theme/components/auth/Header';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

export const newPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  // .regex(
  //   /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  //   'The password must have a Uppercase, lowercase letter and a number'
  // ),
});

const NewPassword = () => {
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
      router.replace('/(tabs)/(home)');
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
    <ScrollView>
      <View
        style={{
          flex: 1,
          gap: 20,
          marginTop: 20,
          padding: 20,
          width: '100%',
          maxWidth: 320,
          marginHorizontal: 'auto',
        }}
      >
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
    </ScrollView>
  );
};

export default NewPassword;
