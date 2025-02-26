import { User } from '@/core/auth/interfaces/user.interface';
import { Plan } from '../../plans/interfaces/plan.interface';

export interface Subscription {
  startDate: string;
  endDate: string;
  status: string;
  user: User;
  plan: Plan;
  updatedAt?: string;
  id: string;
  createdAt: string;
}
