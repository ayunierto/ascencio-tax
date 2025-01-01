import { config } from '@/core/config';

export const signin = async (username: string, password: string) => {
  try {
    const API_URL = config.apiUrl;
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }).then();
    const data = await response.json();

    return data;
  } catch (error) {
    return error;
  }
};
