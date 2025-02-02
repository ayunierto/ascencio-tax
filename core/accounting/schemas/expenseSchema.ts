import { z } from 'zod';

export const expenseSchema = z.object({
  merchant: z.string().min(1, { message: 'The merchant is required' }),
  date: z.string().nonempty({ message: 'The date is required' }),
  total: z.string(),
  tax: z.string(),
  accountId: z.number(),
  categoryId: z.number(),
  subcategoryId: z.number().optional(),
  // notes: z.string().optional(),
});
