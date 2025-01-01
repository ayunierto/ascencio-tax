import { config } from '@/core/config';
import { ServiceResponse } from '../interfaces/services.response';

export const getServices = async (): Promise<ServiceResponse[] | null> => {
  try {
    const API_URL = 'https://ascenciotaxinc-a2594d75dc54.herokuapp.com/api';
    const response = await fetch(`${API_URL}/services`);

    const services = await response.json();

    return services;
  } catch (error) {
    console.error(error);
    return null;
  }
};
