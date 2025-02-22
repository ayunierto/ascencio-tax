import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Card } from '@/presentation/theme/components/ui';
import { ThemedText } from '@/presentation/theme/components/ui/ThemedText';
import { Plan } from '../../plans/interfaces/plan.interface';
import { theme } from '@/presentation/theme/components/ui/Theme';
import Button from '@/presentation/theme/components/ui/Button';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Divider from '@/presentation/theme/components/ui/Divider';
import { usePlanStore } from '../../plans/store/usePlanStore';

interface SubscriptionCardProps {
  plan: Plan;
}

const SubscriptionCard = ({ plan }: SubscriptionCardProps) => {
  const [highestDiscountState, setHighestDiscountState] = useState<number>(0);

  const { setSelectedPlan, setHighestDiscount } = usePlanStore();

  useEffect(() => {
    let maxDiscount = 0;
    plan.discounts.forEach((discount) => {
      if (discount.discount > maxDiscount) {
        maxDiscount = discount.discount;
      }
    });
    setHighestDiscountState(maxDiscount);
  }, [plan]);

  const discountedPrice = +plan.price * (1 - highestDiscountState / 100);

  const onChoosePlan = () => {
    setSelectedPlan(plan);
    setHighestDiscount(highestDiscountState);

    router.push('/accounting/subscriptions/cart');
  };
  return (
    <Card
      style={{
        flex: 1,
        marginHorizontal: 20,
        width: 280,
        gap: 20,
      }}
    >
      <View style={{ gap: 20 }}>
        <ThemedText
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 25,
          }}
        >
          {plan.name}
        </ThemedText>

        <ThemedText style={{ textAlign: 'center', color: theme.muted }}>
          {plan.description}
        </ThemedText>
      </View>

      <View>
        <View
          style={{
            marginBottom: 10,
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <ThemedText
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              textDecorationLine: 'line-through',
            }}
          >
            ${plan.price}
          </ThemedText>
          <ThemedText
            style={{
              backgroundColor: `${theme.primary}33`,
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: theme.radius,
              fontWeight: 'bold',
            }}
          >
            SAVE {highestDiscountState}%
          </ThemedText>
        </View>

        <ThemedText style={{ textAlign: 'center', fontSize: 40 }}>
          <ThemedText style={{ fontSize: 25 }}>$</ThemedText>
          {discountedPrice.toFixed(2)}{' '}
          <ThemedText style={{ color: theme.muted, fontSize: 20 }}>
            / month
          </ThemedText>
        </ThemedText>

        <Button style={{ marginVertical: 20 }} onPress={onChoosePlan}>
          Choose plan
        </Button>

        <Divider style={{ backgroundColor: '#8883', marginVertical: 10 }} />

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
          {plan.features.map((feature, index) => (
            <View style={{ flexDirection: 'row', gap: 8 }} key={index}>
              <Ionicons name="checkmark" size={18} color={'green'} />
              <ThemedText key={index}>{feature}</ThemedText>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
};

export default SubscriptionCard;
