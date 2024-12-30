import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Link, Redirect } from 'expo-router';

import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';

import { Input } from '@/presentation/theme/components/ui/Input';
import Button from '@/presentation/theme/components/ui/Button';
import Toast from 'react-native-toast-message';

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
    if (response.error === 'Inactive') {
      // navigation.navigate('VerifyScreen');
      return;
    }
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
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView>
        <View
          style={{
            padding: 20,
            height: '100%',
          }}
        >
          <View
            style={{
              paddingTop: 40,
              paddingBottom: 40,
              alignItems: 'center',
            }}
          >
            <Image
              source={require('../../../assets/images/logo.webp')}
              style={{
                width: '100%',
                resizeMode: 'contain',
              }}
            />
            <Text
              style={{
                fontSize: 60,
                textAlign: 'center',
                fontWeight: '300',
                color: 'white',
              }}
            >
              Log in
            </Text>
            <Text
              style={{
                marginTop: 20,
                color: 'white',
                fontSize: 16,
              }}
            >
              Don’t have an account?{' '}
              <Link
                href={'/auth/signup'}
                style={{
                  color: 'orange',
                  textDecorationLine: 'underline',
                  fontSize: 16,
                }}
              >
                Sign up.
              </Link>
            </Text>
          </View>

          <View
            style={{
              gap: 20,
            }}
          >
            {errors.root && (
              <Text
                style={{
                  marginTop: -15,
                  color: 'yellow',
                }}
              >
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
              <Text
                style={{
                  marginTop: -15,
                  color: 'yellow',
                }}
              >
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
                  autoCapitalize="words"
                  secureTextEntry
                  placeholder="Enter password"
                  autoComplete="password"
                />
              )}
            />
            {errors.password && (
              <Text
                style={{
                  marginTop: -15,
                  color: 'yellow',
                }}
              >
                {errors.password?.message as string}
              </Text>
            )}

            <Button
              disabled={isLoading}
              onPress={handleSubmit(handleSignin)}
              title="Login"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Signin;
