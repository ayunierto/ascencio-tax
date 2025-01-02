import { create } from 'zustand';
import { User } from '@/core/auth/interfaces/user';
import { RegisterData } from '@/core/auth/interfaces/register.data';
import { checkStatus, signin, signup, verifyCode } from '@/core/auth/actions';

import * as SecureStore from 'expo-secure-store';

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'checking';

export interface AuthState {
  status: AuthStatus;
  token?: string;
  user?: User;

  signin: (email: string, password: string) => Promise<any>;
  signup: (values: RegisterData) => Promise<any>;
  checkStatus: () => Promise<any>;
  logout: () => Promise<boolean>;
  verifyCode: (phoneNumber: string, verfication_code: string) => Promise<any>;
  setAuthenticated: (token: string, user: User) => void;
  setUnauthenticated: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  status: 'checking',
  token: undefined,
  user: undefined,

  signin: async (username: string, password: string) => {
    const response = await signin(username, password);

    if (response.token) {
      await SecureStore.setItemAsync('token', response.token);
      get().setAuthenticated(response.token, response);
      return response;
    }

    get().setUnauthenticated();
    return response;
  },

  signup: async (values: RegisterData) => {
    const response = await signup(values);
    // if (response.verification_code) {
    //   get().setUnauthenticated();
    // }
    if (response.token) {
      await SecureStore.setItemAsync('token', response.token);
      get().setAuthenticated(response.token, response);
      return response;
    }
    get().setUnauthenticated();
    return response;
  },

  checkStatus: async () => {
    const response = await checkStatus();

    if (response.message === 'Network request failed') {
      get().setUnauthenticated();
      return { code: 500, message: 'Network request failed' };
    }

    if (response.token) {
      await SecureStore.setItemAsync('token', response.token);

      get().setAuthenticated(response.token, response.user);
      return { code: 200, message: 'Authenticated', data: response };
    }

    if (response.statusCode === 401) {
      set({ status: 'unauthenticated', token: undefined, user: undefined });
      return false;
    }

    set({ status: 'unauthenticated', token: undefined, user: undefined });
    return false;
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('token');
    get().setUnauthenticated();
    return false;
  },

  verifyCode: async (phoneNumber: string, verification_code: string) => {
    const response = await verifyCode(phoneNumber, verification_code);
    if (response.token) {
      // await StorageAdapter.setItem('token', response.token);

      set({
        status: 'authenticated',
        token: response.token,
        user: response.user,
      });
    }
    return response;
  },

  setAuthenticated: (token: string, user: User) => {
    set({
      status: 'authenticated',
      token: token,
      user: user,
    });
  },
  setUnauthenticated: () => {
    set({
      status: 'unauthenticated',
      token: undefined,
      user: undefined,
    });
  },
}));
