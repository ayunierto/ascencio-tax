// import {StorageAdapter} from '../../config/adapters/storage-adapter';

import Toast from 'react-native-toast-message';

export const checkStatus = async () => {
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    // const token = (await StorageAdapter.getItem('token')) || '';
    const token = '';
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
