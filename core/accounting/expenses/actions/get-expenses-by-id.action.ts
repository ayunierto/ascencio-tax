import * as SecureStore from 'expo-secure-store';
import { Expense } from '../interfaces';

const emptyExpense: Expense = {
  merchant: '',
  date: new Date().toISOString(),
  total: '',
  tax: '',
  image: null,
  notes: null,
  id: 0,
  createdAt: new Date().toISOString(),
  updateAt: null,
  // account: undefined,
  // category: undefined,
  // subcategory: null,
  tags: [],
};

export const getExpenseById = async (id: number): Promise<Expense> => {
  try {
    if (id === 0) {
      return emptyExpense;
    }

    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await fetch(`${API_URL}/expense/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: Expense = await response.json();
    return data;
  } catch (error) {
    throw new Error('Unable to load expense');
  }
};
