import React, { useEffect, useState } from 'react';

import { router, useNavigation } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { getExpenseById } from '../actions/get-expenses-by-id.action';
import { Category } from '../../categories/interfaces/category.interface';
import { expenseSchema } from '../schemas/expenseSchema';
import { getAccounts } from '../../accounts/actions';
import { getCategories } from '../../categories/actions';
import { getSubcategories } from '../../subcategories/actions';
import { Subcategory } from '../../subcategories/interfaces';
import { createUpdateExpense } from '../actions';
import { Expense } from '../interfaces';

interface Option {
  label: string;
  value: string;
}

export const useExpense = (expenseId: number) => {
  console.warn({ useExpenseID: expenseId });
  const navigation = useNavigation();

  const [expense, setExpense] = useState<Expense>();
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState<Option[]>([]);

  // const expensesIdRef = useRef(expenseId);
  const queryClient = useQueryClient();

  const expenseQuery = useQuery({
    queryKey: ['expense', expenseId],
    queryFn: () => getExpenseById(expenseId),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  const accountQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: () => getAccounts(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  const categoryQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  const subcategoryQuery = useQuery({
    queryKey: ['subcategories'],
    queryFn: () => getSubcategories(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  useEffect(() => {
    if (expenseQuery.data) {
      navigation.setOptions({
        title: expenseQuery.data.merchant ?? 'New',
      });

      const expense = expenseQuery.data;
      setValue('merchant', expense.merchant);
      setValue('date', expense.date);
      setValue('total', expense.total);
      setValue('tax', expense.tax);
      setValue('notes', expense.notes ?? '');
      setValue('image', expense.image ? expense.image : undefined);
      if (expense.account) setValue('accountId', expense.account.id);
      if (expense.category) setValue('categoryId', expense.category.id);
      if (expense.subcategory)
        setValue('subcategoryId', expense.subcategory.id);

      setExpense(expenseQuery.data);
    }
  }, [expenseQuery.data]);

  useEffect(() => {
    if (categoryQuery.isSuccess) {
      const options = categoryQuery.data.map((category: Category) => ({
        label: category.name,
        value: category.id.toString(),
      }));
      setCategoryOptions(options);
    }
  }, [categoryQuery.isSuccess, categoryQuery.data]);

  useEffect(() => {
    if (subcategoryQuery.isSuccess) {
      const options = subcategoryQuery.data.map((subcategory: Subcategory) => ({
        label: subcategory.name,
        value: subcategory.id,
      }));
      setSubcategoryOptions(options);
    }
  }, [subcategoryQuery.isSuccess, subcategoryQuery.data]);

  const onChangeCategory = async (label: string, value: string) => {
    const subcategories = subcategoryQuery.data.filter(
      (sub: Subcategory) => sub.category!.id === +value
    );
    const options = subcategories.map((sub: Subcategory) => ({
      label: sub.name,
      value: sub.id,
    }));
    setSubcategoryOptions(options);
  };

  const expenseMutation = useMutation({
    mutationFn: async () => {
      const image = getValues('image');
      const data = await createUpdateExpense({
        accountId: getValues('accountId'),
        categoryId: getValues('categoryId'),
        date: getValues('date'),
        id: expenseId,
        merchant: getValues('merchant'),
        notes: getValues('notes'),
        subcategoryId: getValues('subcategoryId'),
        tax: +getValues('tax'),
        total: +getValues('total'),
        image: image && image.includes('file') ? image : undefined,
      });
      return data;
    },

    onSuccess: (data: Expense) => {
      queryClient.invalidateQueries({
        queryKey: ['expenses', 'infinite'],
      });
      queryClient.invalidateQueries({
        queryKey: ['expense', expenseId],
      });
      Toast.show({
        type: 'success',
        text1: 'Receipt saved',
        text2: 'Receipt was saved correctly',
      });
      router.replace('/accounting/receipts/expense');
    },
  });

  const onSubmit = async (values: z.infer<typeof expenseSchema>) => {
    await expenseMutation.mutateAsync();
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      merchant: expenseQuery.data?.merchant,
      tax: expenseQuery.data?.tax,
      total: expenseQuery.data?.total,
    },
  });

  return {
    expense,
    expenseQuery,
    accountQuery,
    categoryOptions,
    subcategoryOptions,
    control,
    errors,
    setValue,
    handleSubmit,
    onChangeCategory,
    onSubmit,
    isLoading: expenseQuery.isLoading || accountQuery.isLoading,
  };
};
