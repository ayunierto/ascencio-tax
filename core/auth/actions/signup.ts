import { config } from '@/core/config';
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
  const API_URL = 'https://ascenciotaxinc-a2594d75dc54.herokuapp.com/api';
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
    console.error(error);
    return error;
  }
};
