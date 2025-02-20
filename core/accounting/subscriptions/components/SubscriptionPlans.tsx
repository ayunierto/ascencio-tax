import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: 'monthly' | 'annual';
}

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ plans }) => {
  return (
    <View style={styles.container}>
      {plans.map((plan) => (
        <TouchableOpacity key={plan.id} style={styles.planContainer}>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={styles.planPrice}>
            ${plan.price} / {plan.duration === 'monthly' ? 'month' : 'year'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  planContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  planPrice: {
    fontSize: 14,
  },
});

export default SubscriptionPlans;
