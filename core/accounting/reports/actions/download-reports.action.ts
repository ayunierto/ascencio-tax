import * as SecureStore from 'expo-secure-store';

export const DownloadReport = async (startDate: string, endDate: string) => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const token = await SecureStore.getItemAsync('token');
  if (!token) {
    throw new Error('Token not found');
  }

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', `Bearer ${token}`);

  const raw = JSON.stringify({
    startDate: startDate,
    endDate: endDate,
  });

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    body: raw,
  };

  try {
    const response = await fetch(`${API_URL}/reports/generate`, requestOptions);
    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error(error);
    throw new Error('Unable to load reports');
  }
};
