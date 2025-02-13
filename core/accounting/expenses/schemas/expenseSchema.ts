import { z } from 'zod';

export const expenseSchema = z.object({
  accountId: z.number(),
  categoryId: z.number(),
  date: z.string().nonempty({ message: 'The date is required' }),
  // id: z.number(),
  image: z.string().optional(),
  merchant: z.string().min(1, { message: 'The merchant is required' }),
  notes: z.string().optional(),
  subcategoryId: z.number().optional(),
  tax: z
    .string()
    .regex(/^\d+(\.\d+)?$/, 'Only numbers with decimals are allowed'),
  total: z
    .string()
    .regex(/^\d+(\.\d+)?$/, 'Only numbers with decimals are allowed'),
});
