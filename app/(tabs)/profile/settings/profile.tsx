import { View, ScrollView, Text, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import Signin from '../auth/sign-in';
import Button from '@/presentation/theme/components/ui/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/presentation/theme/components/auth/Header';
import { Input } from '@/presentation/theme/components/ui/Input';

import { z } from 'zod';
import { Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfile } from '@/core/user/actions';
import Toast from 'react-native-toast-message';

export const profileSchema = z
  .object({
    name: z.string().min(3, 'First name must be at least 3 characters'),
    lastName: z.string().min(3, 'First name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    phoneNumber: z.string().nonempty('The phone number is required'),
    password: z
      .string()
      // .min(6, 'Password must be at least 6 characters')
      .optional(),
    // .regex(
    //   /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    //   'Password must include uppercase, lowercase and numbers'
    // ),
    confirmPassword: z
      .string()
      // .min(6, 'Password must be at least 6 characters')
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const { token, logout, user } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      confirmPassword: '',
      password: '',
      email: user?.email,
      lastName: user?.lastName,
      name: user?.name,
      phoneNumber: user?.phoneNumber,
    },
  });

  if (!token) {
    return <Signin />; // Use replace to avoid stacking profile on top of sign-in
  }

  const handleUpdateProfile = async (values: z.infer<typeof profileSchema>) => {
    setLoading(true);
    const response = await updateProfile({
      name: values.name,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      password: values.password,
    });
    setLoading(false);
    console.warn(response);

    // Unauthorized

    if (response.statusCode === 400) {
      setError('root', {
        type: 'manual',
        message: response.message[0],
      });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: response.message[0],
      });
      return;
    }

    // if (response.statusCode === 409) {
    //   if (response.message.includes('phoneNumber')) {
    //     setError('phoneNumber', {
    //       type: 'manual',
    //       message:
    //         'Your phone number is already being used by an existing AscencioTax account.',
    //     });
    //     return;
    //   }
    // }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <KeyboardAvoidingView behavior="padding">
          <View
            style={{
              flex: 1,
              gap: 20,
              padding: 20,
              width: '100%',
              maxWidth: 320,
              marginHorizontal: 'auto',
            }}
          >
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="First name"
                  autoCapitalize="words"
                  autoComplete="name"
                />
              )}
            />
            {errors.name && (
              <Text className="-mt-4 text-yellow-400">
                {errors.name?.message as string}
              </Text>
            )}
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Last name"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  autoCapitalize="words"
                  autoComplete="name-family"
                />
              )}
            />
            {errors.lastName && (
              <Text className="-mt-4 text-yellow-400">
                {errors.lastName?.message as string}
              </Text>
            )}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  placeholder="Email"
                  autoCapitalize="none"
                  autoComplete="email"
                  readOnly={true}
                />
              )}
            />
            {errors.email && (
              <Text className="-mt-4 text-yellow-400">
                {errors.email?.message as string}
              </Text>
            )}

            <Controller
              control={control}
              name="phoneNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                  placeholder="Phone Number"
                  autoCapitalize="none"
                  autoComplete="tel"
                  className="flex-1"
                />
              )}
            />
            {errors.phoneNumber && (
              <Text className="-mt-4 text-yellow-400">
                {errors.phoneNumber?.message as string}
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
                  autoCapitalize="none"
                  secureTextEntry
                  placeholder="Password"
                  autoComplete="password-new"
                />
              )}
            />
            {errors.password && (
              <Text className="-mt-4 text-yellow-400">
                {errors.password?.message as string}
              </Text>
            )}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  secureTextEntry
                  placeholder="Confirm Password"
                  autoComplete="password-new"
                />
              )}
            />
            {errors.confirmPassword && (
              <Text className="-mt-4 text-yellow-400">
                {errors.confirmPassword?.message as string}
              </Text>
            )}
            <Button
              loading={loading}
              disabled={loading}
              onPress={handleSubmit(handleUpdateProfile)}
            >
              Update
            </Button>
            <Button
              iconRight={
                <Ionicons name="log-out-outline" size={24} color="white" />
              }
              variant="destructive"
              onPress={() => logout()}
            >
              Logout
            </Button>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
