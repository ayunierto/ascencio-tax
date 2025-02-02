import * as SecureStore from 'expo-secure-store';

interface SaveExpenseProp {
  accountId: number;
  categoryId: number;
  date: string;
  merchant: string;
  notes?: string;
  subcategoryId?: number | null;
  tax: number;
  total: number;
}

export const SaveExpense = async ({
  accountId,
  categoryId,
  date,
  merchant,
  notes = '',
  subcategoryId = null,
  tax,
  total,
}: SaveExpenseProp) => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await fetch(`${API_URL}/expense`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        accountId,
        categoryId,
        date,
        merchant,
        subcategoryId,
        tax,
        total,
        notes,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};
