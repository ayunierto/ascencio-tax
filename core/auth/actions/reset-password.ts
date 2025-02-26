import { User } from '../interfaces/user.interface';

export const resetPassword = async (username: string): Promise<User> => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    const data: User = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Network request failed');
  }
};
