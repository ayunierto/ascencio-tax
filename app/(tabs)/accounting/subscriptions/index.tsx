import React from 'react';
import { Card } from '@/presentation/theme/components/ui';
import { FlatList, View } from 'react-native';
import { ThemedText } from '@/presentation/theme/components/ui/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/presentation/theme/components/ui/Theme';
import Divider from '@/presentation/theme/components/ui/Divider';
import Button from '@/presentation/theme/components/ui/Button';
import { router } from 'expo-router';

const SubscriptionsScreen = () => {
  const plans = React.useMemo(
    () => [
      {
        name: 'Basic',
        description: 'Ideal for freelancers and small businesses starting out.',
        price: 10,
        save: 'Save 10%',
        features: [
          'Up to 50 receipts per month',
          'Basic reporting',
          'Manual data entry',
        ],
      },
      {
        name: 'Pro',
        description:
          'Perfect for growing businesses needing advanced features.',
        price: 20,
        save: 'Save 20%',
        features: [
          'Up to 200 receipts per month',
          'Advanced reporting and analytics',
          'Automatic data extraction',
          'Multi-user access',
        ],
      },
      {
        name: 'Enterprise',
        description:
          'For large organizations requiring unlimited usage and support.',
        price: 30,
        save: 'Save 30%',
        features: [
          'Up to 500 receipts per month',
          'Customizable reports',
          'Dedicated support',
          'API access',
        ],
      },
    ],
    []
  );
  return (
    <View style={{ flex: 1, marginVertical: 20, gap: 20 }}>
      <View style={{ marginHorizontal: 20 }}>
        <ThemedText
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          Choose the perfect plan for you
        </ThemedText>
        <ThemedText style={{ color: theme.muted, textAlign: 'left' }}>
          Choose the plan that best fits your needs and enjoy all the benefits
          of our platform.
        </ThemedText>
      </View>
      <FlatList
        data={plans}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <Card
            style={{
              flex: 1,
              marginHorizontal: 20,
              width: 280,
              gap: 20,
            }}
          >
            <View style={{}}>
              <ThemedText
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 25,
                }}
              >
                {item.name}
              </ThemedText>
              <ThemedText style={{ textAlign: 'center', color: theme.muted }}>
                {item.description}
              </ThemedText>
            </View>
            <View>
              <View style={{ alignSelf: 'center', marginBottom: 10 }}>
                <ThemedText
                  style={{
                    backgroundColor: `${theme.primary}33`,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: theme.radius,
                  }}
                >
                  {item.save}
                </ThemedText>
              </View>
              <ThemedText style={{ textAlign: 'center', fontSize: 40 }}>
                <ThemedText style={{ fontSize: 25 }}>$</ThemedText>
                {item.price}{' '}
                <ThemedText style={{ color: theme.muted, fontSize: 20 }}>
                  / month
                </ThemedText>
              </ThemedText>
              <Button
                style={{ marginVertical: 20 }}
                onPress={() =>
                  router.push('/accounting/subscriptions/select-preferences')
                }
              >
                Choose plan
              </Button>
              <Divider
                style={{ backgroundColor: '#8883', marginVertical: 10 }}
              />
              <ThemedText
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 10,
                }}
              >
                Features
              </ThemedText>
              <View style={{ gap: 5 }}>
                {item.features.map((feature, index) => (
                  <View style={{ flexDirection: 'row', gap: 8 }} key={index}>
                    <Ionicons name="checkmark" size={18} color={'green'} />
                    <ThemedText key={index}>{feature}</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          </Card>
        )}
        // contentContainerStyle={{ maxHeight: 500 }}
      />
    </View>
  );
};

export default SubscriptionsScreen;
