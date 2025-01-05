import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  Image,
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
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

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

const registerUserSchema = z
  .object({
    name: z.string().min(3, 'First name must be at least 3 characters'),
    lastName: z.string().min(3, 'First name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    countryCode: z.string().nonempty('The country code is required'),
    phoneNumber: z.string().nonempty('The phone number is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        'Password must include uppercase, lowercase and numbers'
      ),
    confirmPassword: z
      .string()
      .min(8, 'Confirm Password must be at least 8 characters')
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

const Signup = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setFocus,
    setValue,
  } = useForm<z.infer<typeof registerUserSchema>>({
    resolver: zodResolver(registerUserSchema),
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

  const handleSignup = async (values: z.infer<typeof registerUserSchema>) => {
    setLoading(true);
    const response = await signup(values);
    if (response.id) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Your account has been created successfully',
      });
      router.replace('/');
    }
    setLoading(false);

    // if (response.verification_code) {
    // navigation.navigate('VerifyScreen');
    // }

    if (response.statusCode === 400) {
      setError('root', {
        type: 'manual',
        message: response.message[0],
      });
    }

    if (response.code === 409) {
      if (response.cause === 'email') {
        setFocus('email');
        setError('email', {
          type: 'manual',
          message:
            'Your email is already being used by an existing AscencioTax account. You can go the AscencioTax login screen to login using this email.',
        });
        return;
      }
      if (response.cause.includes('phoneNumber')) {
        setFocus('phoneNumber');
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
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <SafeAreaView>
        <ScrollView>
          <View className="flex flex-col gap-5 p-5 max-w-['500'] mx-auto">
            <View className="flex gap-5">
              <Image
                source={require('../../../assets/images/logo.webp')}
                style={{
                  width: '100%',
                  resizeMode: 'contain',
                }}
              />
              <Text className="text-4xl color-white text-center">Sign up</Text>
              <Text className="text-white text-center ">
                Already have an account?{' '}
                <Text
                  onPress={() => router.replace('/auth/signin')}
                  className="text-blue-100 underline"
                >
                  Log in
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
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <Select
                  options={countryCodes}
                  onSelect={(item) => setValue('countryCode', item?.value)}
                  placeholder="+1"
                  style={{
                    flex: 1,
                  }}
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
                      autoComplete="tel-device"
                      style={{
                        flex: 1,
                      }}
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
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Signup;
