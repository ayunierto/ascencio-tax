export const verifyCode = async (
  username: string,
  verificationCode: string
) => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  try {
    const response = await fetch(`${API_URL}/auth/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, verificationCode }),
    }).then((data) => data.json());

    return response;
  } catch (error) {
    return error;
  }
};
