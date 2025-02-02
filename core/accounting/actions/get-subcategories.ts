import * as SecureStore from 'expo-secure-store';

export const getSubcategories = async () => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const response = await fetch(`${API_URL}/subcategory`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};
