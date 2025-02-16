import * as SecureStore from 'expo-secure-store';
import { CreateUpdateExpense, Expense } from '../interfaces';
import { uploadImage } from '@/core/files/actions/upload-image.action';

export const createUpdateExpense = async (
  expense: CreateUpdateExpense
): Promise<Expense> => {
  if (expense.id !== 0) {
    return await updateExpense(expense);
  }

  return createExpense(expense);
};

const updateExpense = async (
  expense: Partial<CreateUpdateExpense>
): Promise<Expense> => {
  const { id, ...rest } = expense;

  if (expense.image) {
    const uploadedImage = await uploadImage(expense.image);
    rest.image = uploadedImage.image;
  }

  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Token not found');
    }
    const response = await fetch(`${API_URL}/expense/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(rest),
    });
    const data: Expense = await response.json();
    return data;
  } catch (error) {
    throw new Error('The receipt could not be updated');
  }
};

const createExpense = async (
  expense: CreateUpdateExpense
): Promise<Expense> => {
  const { id, ...rest } = expense;

  if (expense.image) {
    const uploadedImage = await uploadImage(expense.image);
    rest.image = uploadedImage.image;
  }

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
      body: JSON.stringify(rest),
    });
    const data: Expense = await response.json();
    return data;
  } catch (error) {
    throw new Error('The receipt could not be created');
  }
};
