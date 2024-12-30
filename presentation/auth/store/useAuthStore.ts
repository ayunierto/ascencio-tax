import { create } from 'zustand';
// import { StorageAdapter } from '../../../config/adapters/storage-adapter';
import { User } from '@/core/auth/interfaces/user';
import { RegisterData } from '@/core/auth/interfaces/register.data';
import { checkStatus, signin, signup, verifyCode } from '@/core/auth/actions';

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'checking';

export interface AuthState {
  status: AuthStatus;
  token?: string;
  user?: User;

  signin: (email: string, password: string) => Promise<any>;
  signup: (values: RegisterData) => Promise<any>;
  checkStatus: () => Promise<boolean>;
  logout: () => Promise<boolean>;
  verifyCode: (phone_number: string, verfication_code: string) => Promise<any>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  status: 'checking',
  token: undefined,
  user: undefined,

  signin: async (username: string, password: string) => {
    const response = await signin(username, password);
    console.warn(response);

    if (response.token) {
      // await StorageAdapter.setItem('token', response.token);
      set({
        status: 'authenticated',
        token: response.token,
        user: response.user,
      });
      return response;
    }

    set({ status: 'unauthenticated', token: undefined, user: undefined });
    return response;
  },

  signup: async (values: RegisterData) => {
    const response = await signup(values);
    if (response.verification_code) {
      set({ status: 'unauthenticated', token: undefined, user: response });
    }
    return response;
  },

  checkStatus: async () => {
    const response = await checkStatus();

    if (response.token) {
      // await StorageAdapter.setItem('token', response.token);
      set({
        status: 'authenticated',
        token: response.token,
        user: response.user,
      });
      return true;
    }

    if (response.statusCode === 401) {
      set({ status: 'unauthenticated', token: undefined, user: undefined });
      return false;
    }

    set({ status: 'unauthenticated', token: undefined, user: undefined });
    return false;
  },

  logout: async () => {
    // const response = await StorageAdapter.removeItem('token');
    // if (response) {
    //   set({ status: 'unauthenticated', token: undefined, user: undefined });
    //   return true;
    // }
    return false;
  },

  verifyCode: async (phone_number: string, verification_code: string) => {
    const response = await verifyCode(phone_number, verification_code);
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
}));
