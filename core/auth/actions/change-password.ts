import * as SecureStore from 'expo-secure-store';

export const changePassword = async (password: string) => {
  try {
    const token = (await SecureStore.getItemAsync('token')) || '';
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    }).then();
    const data = await response.json();

    return data;
  } catch (error) {
    return error;
  }
};
