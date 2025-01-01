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
import { Link, router } from 'expo-router';
import Button from '@/presentation/theme/components/ui/Button';
import Select from '@/presentation/theme/components/ui/Select';
import { countries } from '@/countryData';
import Toast from 'react-native-toast-message';

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
    console.warn(response);
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
      if (response.cause === 'phoneNumber') {
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
      <ScrollView>
        <View
          style={{
            padding: 20,
            height: '100%',
          }}
        >
          <View
            style={{
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
                textAlign: 'center',
                fontWeight: '300',
                color: 'white',
                fontSize: 60,
              }}
            >
              Sign up
            </Text>
            <Text style={{ color: 'white', fontSize: 16 }}>
              Already have an account?{' '}
              <Link
                href={'/auth/signin'}
                style={{
                  color: 'orange',
                  textDecorationLine: 'underline',
                  fontSize: 16,
                }}
              >
                Log in
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
              <Text
                style={{
                  marginTop: -15,
                  color: 'yellow',
                }}
              >
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
              <Text
                style={{
                  marginTop: -15,
                  color: 'yellow',
                }}
              >
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
              <Text
                style={{
                  marginTop: -15,
                  color: 'yellow',
                }}
              >
                {errors.email?.message as string}
              </Text>
            )}
            <View style={{ flexDirection: 'row', gap: 20 }}>
              <Select
                options={countryCodes}
                onSelect={(item) => setValue('countryCode', item?.value)}
                placeholder="Country"
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
                      flex: 3,
                    }}
                  />
                )}
              />
            </View>
            {errors.phoneNumber && (
              <Text
                style={{
                  marginTop: -15,
                  color: 'yellow',
                }}
              >
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
              <Text
                style={{
                  marginTop: -15,
                  color: 'yellow',
                }}
              >
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
              <Text
                style={{
                  marginTop: -15,
                  color: 'yellow',
                }}
              >
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
    </KeyboardAvoidingView>
  );
};

export default Signup;
