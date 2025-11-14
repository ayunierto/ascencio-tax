import { Staff } from '@/core/staff/interfaces';

export interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  description?: string;
  address: string;
  isAvailableOnline: boolean;
  isActive: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
  staff?: Staff[];
  deletedAt: string;
}

