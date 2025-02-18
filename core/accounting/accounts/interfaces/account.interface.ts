import { User } from '@/core/auth/interfaces/user';
import { AccountType } from '../../accounts-types/interfaces';
import { Currency } from '../../currencies/interfaces';

export interface Account {
  accountType: AccountType;
  createdAt: string;
  currency: Currency;
  description: string;
  icon: string;
  id: string;
  name: string;
  updatedAt: string | null;
  user: User;
}
