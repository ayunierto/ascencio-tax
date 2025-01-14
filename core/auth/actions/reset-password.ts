export const resetPassword = async (username: string) => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    }).then();
    const data = await response.json();

    return data;
  } catch (error) {
    return error;
  }
};
