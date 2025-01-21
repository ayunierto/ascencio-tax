import { UpdateProfile } from '../interfaces/update-profile.interface';
import * as SecureStore from 'expo-secure-store';

export const updateProfile = async ({
  lastName,
  name,
  password,
  phoneNumber,
}: UpdateProfile) => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const token = (await SecureStore.getItemAsync('token')) || '';

  const userUpdate = {
    lastName,
    name,
    password,
    phoneNumber,
  };

  if (!password) {
    delete userUpdate.password;
  }

  try {
    const response = await fetch(`${API_URL}/users/update-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userUpdate),
    }).then((data) => data.json());

    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};
