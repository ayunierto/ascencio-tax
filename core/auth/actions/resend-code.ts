export const resendCode = async (
  username: string,
  verificationPlatform: 'email' | 'phone'
) => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  try {
    const response = await fetch(`${API_URL}/auth/resend-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.toLocaleLowerCase().trim(),
        verificationPlatform: verificationPlatform,
      }),
    }).then((data) => data.json());

    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};
