import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';

import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import { useState } from 'react';
import { Input } from '@/presentation/theme/components/ui/Input';
import { router } from 'expo-router';
import Button from '@/presentation/theme/components/ui/Button';
import Select from '@/presentation/theme/components/ui/Select';
import { countries } from '@/countryData';
import Header from '../../../../presentation/theme/components/auth/Header';
import { signupSchema } from '@/core/auth/schemas/signupSchema';
import Logo from '@/presentation/theme/components/Logo';

const countryCodes: { label: string; value: string }[] = [];

const transformCountries = () => {
  countries.map((country) => {
    countryCodes.push({
      label: `${country.name} (${country.phone_code})`,
      value: country.phone_code,
    });
  });
};
transformCountries();

const Signup = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      confirmPassword: '',
      password: '',
      email: '',
      lastName: '',
      name: '',
      countryCode: '',
      phoneNumber: '',
    },
  });

  const { signup } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    setLoading(true);
    const response = await signup(values);
    setLoading(false);

    if (response.verificationCode) {
      router.push('/(tabs)/profile/auth/verify');
    }

    if (response.statusCode === 400) {
      setError('root', {
        type: 'manual',
        message: response.message[0],
      });
    }

    if (response.statusCode === 409) {
      if (response.message.toLowerCase().includes('email')) {
        setError('email', {
          type: 'manual',
          message:
            'Your email is already being used by an existing AscencioTax account. You can go the AscencioTax login screen to login using this email.',
        });
        return;
      }
      if (response.message.includes('phoneNumber')) {
        setError('phoneNumber', {
          type: 'manual',
          message:
            'Your phone number is already being used by an existing AscencioTax account. You can go the AscencioTax login screen to login using this phone number.',
        });
        return;
      }
    }
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
              link={'/(tabs)/profile/auth/sign-in'}
              linkText="Sign In"
              subtitle="Already have an account? "
              title="Sign Up"
            />

            <View className="flex gap-5">
              {errors.root && (
                <Text className="-mt-4 text-yellow-400">
                  {errors.root?.message as string}
                </Text>
              )}

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
                  />
                )}
              />
              {errors.email && (
                <Text className="-mt-4 text-yellow-400">
                  {errors.email?.message as string}
                </Text>
              )}
              <View className="flex flex-row gap-2">
                <Select
                  options={countryCodes}
                  onSelect={(item) => setValue('countryCode', item?.value)}
                  placeholder="+1"
                  style={{ flex: 1 }}
                />
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
                      style={{ flex: 2 }}
                    />
                  )}
                />
              </View>
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
                onPress={handleSubmit(handleSignup)}
              >
                Sign up
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
