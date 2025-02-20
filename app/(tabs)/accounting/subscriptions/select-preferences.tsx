import { View } from 'react-native';
import React from 'react';
import { ThemedText } from '@/presentation/theme/components/ui/ThemedText';
import { theme } from '@/presentation/theme/components/ui/Theme';
import Select from '@/presentation/theme/components/ui/Select';
import { Card } from '@/presentation/theme/components/ui';
import Divider from '@/presentation/theme/components/ui/Divider';
import { Input } from '@/presentation/theme/components/ui/Input';
import Button from '@/presentation/theme/components/ui/Button';
import { router } from 'expo-router';

const SelectPreferencesScreen = () => {
  return (
    <View style={{ padding: 20 }}>
      <ThemedText
        style={{
          fontSize: 30,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 20,
        }}
      >
        Your cart
      </ThemedText>

      <Card
        style={{
          padding: 20,
          marginBottom: 20,
        }}
      >
        <ThemedText
          style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 10 }}
        >
          Basic Plan
        </ThemedText>
        <Divider style={{ backgroundColor: '#8883', marginVertical: 20 }} />

        {/* <ThemedText style={{ marginBottom: 5 }}>Period</ThemedText> */}
        <Select
          placeholder="Select period"
          enableFilter={false}
          options={[
            { label: '1 month', value: '1' },
            { label: '6 months', value: '6' },
            { label: '12 months', value: '12' },
            { label: '24 months', value: '24' },
            { label: '48 months', value: '48' },
          ]}
          style={{ marginBottom: 20 }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <ThemedText
            style={{ marginBottom: 10, fontSize: 20, fontWeight: 'bold' }}
          >
            $4.99/month
          </ThemedText>
          <ThemedText
            style={{
              backgroundColor: `${theme.primary}33`,
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: theme.radius,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Save $59.88
          </ThemedText>
        </View>
      </Card>
      <Card>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          <ThemedText style={{ fontSize: 25, fontWeight: 'bold' }}>
            Subtotal
          </ThemedText>
          <ThemedText style={{ fontSize: 20, fontWeight: 'bold' }}>
            $59.88
          </ThemedText>
        </View>

        <ThemedText
          style={{
            marginBottom: 20,
            color: theme.muted,
          }}
        >
          Subtotal does not include applicable taxes
        </ThemedText>

        <ThemedText
          style={{ fontSize: 16, color: theme.primary, marginBottom: 10 }}
        >
          Do you have a discount coupon?
        </ThemedText>
        <ThemedText style={{ color: theme.muted, marginBottom: 10 }}>
          Enter the discount coupon
        </ThemedText>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginBottom: 30,
          }}
        >
          <Input placeholder="Coupon" style={{ flex: 2 }} />
          <Button style={{ flex: 1 }}>Apply</Button>
        </View>
        <Button
          onPress={() => router.push('/accounting/subscriptions/checkout')}
        >
          Continue
        </Button>
      </Card>
    </View>
  );
};

export default SelectPreferencesScreen;
