import React from 'react';

import { ScrollView, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@/presentation/theme/components/ui';
import Button from '@/presentation/theme/components/ui/Button';
import Divider from '@/presentation/theme/components/ui/Divider';
import { Input } from '@/presentation/theme/components/ui/Input';
import { theme } from '@/presentation/theme/components/ui/Theme';
import { ThemedText } from '@/presentation/theme/components/ui/ThemedText';

const CheckoutScreen = () => {
  return (
    <ScrollView>
      <View style={{ padding: 20, gap: 10 }}>
        <Card style={{ gap: 10 }}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardTitle}>Order Summary</ThemedText>
          </View>
          <ThemedText style={styles.cardSubtitle}>Basic Plan</ThemedText>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <ThemedText>1 month plan</ThemedText>
            <ThemedText>$9.99</ThemedText>
          </View>
          <Divider style={{ marginVertical: 10 }} />

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <ThemedText style={styles.cardSubtitle}>Subtotal</ThemedText>
            <ThemedText>$9.99</ThemedText>
          </View>
          <Divider style={{ marginVertical: 10 }} />

          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <ThemedText style={styles.cardSubtitle}>Total</ThemedText>
            <ThemedText style={styles.cardSubtitle}>$14.99</ThemedText>
          </View>
        </Card>

        <Card style={{ gap: 20 }}>
          <View style={styles.cardHeader}>
            <View style={styles.cardNumber}>
              <ThemedText
                style={{
                  color: theme.primary,
                }}
              >
                1
              </ThemedText>
            </View>
            <ThemedText style={styles.cardTitle}>Billing address</ThemedText>
          </View>

          <View style={styles.inputsContainer}>
            <View style={styles.inputContainer}>
              <ThemedText>Name</ThemedText>
              <Input placeholder="Name" />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText>Last name</ThemedText>
              <Input placeholder="Last name" />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText>Phone number</ThemedText>
              <Input placeholder="Phone number" />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText>Country of residence *</ThemedText>
              <Input placeholder="Country of residence" />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText>Address</ThemedText>
              <Input placeholder="Address" />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText>City</ThemedText>
              <Input placeholder="City" />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText>Region/province</ThemedText>
              <Input placeholder="Region/province" />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText>Postal code</ThemedText>
              <Input placeholder="Postal code" />
            </View>
          </View>
        </Card>

        <Card style={{ gap: 20 }}>
          <View style={styles.cardHeader}>
            <View style={styles.cardNumber}>
              <ThemedText
                style={{
                  color: theme.primary,
                }}
              >
                2
              </ThemedText>
            </View>
            <ThemedText style={styles.cardTitle}>Pay</ThemedText>
          </View>

          <View style={styles.inputsContainer}>
            <View style={styles.inputContainer}>
              <ThemedText>Name on the card</ThemedText>
              <Input placeholder="Name on the card" />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText>Card number</ThemedText>
              <Input placeholder="0000 0000 0000 0000" />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText>Expiration date</ThemedText>
              <Input placeholder="MM/AA" />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText>CVC/CVV *</ThemedText>
              <Input placeholder="123" />
            </View>
          </View>

          <Button>Send payment</Button>
          <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={theme.primary}
            />
            <ThemedText> Encrypted and secure payments</ThemedText>
          </View>
          <ThemedText>
            By completing the purchase, you agree to our{' '}
            <Link
              style={{
                color: theme.primary,
                textDecorationLine: 'underline',
              }}
              href={'/'}
            >
              Terms of Service
            </Link>{' '}
            and you confirm that you have read our{' '}
            <Link
              href={'/'}
              style={{ color: theme.primary, textDecorationLine: 'underline' }}
            >
              Privacy Policy
            </Link>
            . You can cancel recurring payments at any time.
          </ThemedText>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cardHeader: { flexDirection: 'row', gap: 10 },
  cardNumber: {
    width: 30,
    height: 30,
    alignItems: 'center',
    borderColor: 'gray',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 9999,
  },
  cardTitle: { fontSize: 20, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 18, fontWeight: 'bold' },
  inputsContainer: { gap: 10 },
  inputContainer: { gap: 5 },
});

export default CheckoutScreen;
