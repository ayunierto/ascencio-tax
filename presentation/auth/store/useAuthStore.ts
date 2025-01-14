import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { User } from '@/core/auth/interfaces/user';
import { RegisterData } from '@/core/auth/interfaces/register.data';
import {
  checkStatus,
  signin,
  signup,
  verifyCode,
  changePassword,
  resetPassword,
} from '@/core/auth/actions';

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'checking';

export interface AuthState {
  status: AuthStatus;
  token?: string;
  user?: User;

  signin: (email: string, password: string) => Promise<any>;
  signup: (values: RegisterData) => Promise<any>;
  checkStatus: () => Promise<any>;
  logout: () => Promise<boolean>;
  verifyCode: (username: string, verificationCode: string) => Promise<any>;
  setAuthenticated: (token: string, user: User) => void;
  setUnauthenticated: () => void;
  setUser: (user: User) => void;
  resetPassword: (username: string) => Promise<any>;
  changePassword: (password: string) => Promise<any>;
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
    if (response.verificationCode) {
      set({
        status: 'unauthenticated',
        token: undefined,
        user: response,
      });
      return response;
    }
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
      get().setUnauthenticated();
      return false;
    }

    get().setUnauthenticated();
    return false;
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('token');
    get().setUnauthenticated();
    return false;
  },

  verifyCode: async (username: string, verificationCode: string) => {
    const response = await verifyCode(username, verificationCode);
    if (response.token) {
      await SecureStore.setItemAsync('token', response.token);
      get().setAuthenticated(response.token, response.user);
      return response;
    }
    return response;
  },

  resetPassword: async (username: string) => {
    const response = await resetPassword(username);
    if (response.email) {
      set({ user: response });
    }
    return response;
  },

  changePassword: async (password: string) => {
    const response = await changePassword(password);
    if (response.token) {
      set({ user: response });
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

  setUser: (user: User) => {
    set({
      user: user,
    });
  },
}));
