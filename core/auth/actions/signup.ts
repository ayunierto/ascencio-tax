import { RegisterData } from '../interfaces/register.data';

export const signup = async ({
  email,
  lastName,
  name,
  password,
  phoneNumber,
  countryCode,
}: RegisterData) => {
  email = email.toLocaleLowerCase().trim();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        lastName,
        name,
        password,
        countryCode,
        phoneNumber,
      }),
    }).then((data) => data.json());

    return response;
  } catch (error) {
    return error;
  }
};
