import * as SecureStore from 'expo-secure-store';

export const checkStatus = async () => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const token = (await SecureStore.getItemAsync('token')) || '';

    const response = await fetch(`${API_URL}/auth/check-status`, {
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
