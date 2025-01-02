import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { router } from 'expo-router';

import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';

import { Input } from '@/presentation/theme/components/ui/Input';
import Button from '@/presentation/theme/components/ui/Button';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

const loginUserSchema = z.object({
  username: z
    .string()
    .refine(
      (value) =>
        z.string().email().safeParse(value).success ||
        /^\+\d{1,3}\d{10}$/.test(value),
      {
        message: 'Username must be a valid email address or phone number',
      }
    ),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      'Password must include uppercase, lowercase and numbers'
    ),
});

const Signin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<z.infer<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const { signin } = useAuthStore();

  const handleSignin = async (values: z.infer<typeof loginUserSchema>) => {
    setIsLoading(true);
    const response = await signin(values.username, values.password);
    setIsLoading(false);
    if (response.error === 'Unauthorized') {
      setError('root', {
        type: 'manual',
        message:
          response.message +
          '. Please check your credentials or register a new account.',
      });
      return;
    }
    if (response.token) {
      router.replace('/');
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <SafeAreaView>
        <ScrollView>
          <View className="flex flex-col gap-5 p-5 max-w-['500'] mx-auto">
            <View className="flex gap-5">
              <Image
                source={require('../../../assets/images/logo.webp')}
                style={{
                  width: '100%',
                  height: 200,
                  resizeMode: 'contain',
                }}
              />
              <Text className="text-4xl color-white text-center">Log in</Text>
              <Text className="color-white text-center">
                Don’t have an account?{' '}
                <Text
                  onPress={() => router.replace('/auth/signup')}
                  className="text-blue-100 underline"
                >
                  Sign up.
                </Text>
              </Text>
            </View>

            <View className="flex gap-5">
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
                  />
                )}
              />
              {errors.password && (
                <Text className="-mt-4 text-yellow-400">
                  {errors.password?.message as string}
                </Text>
              )}

              <Button
                loading={isLoading}
                disabled={isLoading}
                onPress={handleSubmit(handleSignin)}
              >
                Log in
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Signin;
