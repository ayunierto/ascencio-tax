import React, { useCallback, useEffect, useState } from 'react';

import { router, useFocusEffect, useNavigation } from 'expo-router';
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
import { createUpdateExpense, removeExpense } from '../actions';
import { Expense } from '../interfaces';
import { useCameraStore } from '@/core/camera/store';
import { Alert } from 'react-native';

interface Option {
  label: string;
  value: string;
}

export const useExpense = (expenseId: number) => {
  const navigation = useNavigation();

  const [expense, setExpense] = useState<Expense>();
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState<Option[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Option>();
  const [selectedCategory, setSelectedCategory] = useState<Option>();
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { selectedImages, clearImages } = useCameraStore();

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

      setExpenseData(expenseQuery.data);
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

  const onChangeCategory = async (value: string) => {
    const subcategories = subcategoryQuery.data.filter(
      (subcategory: Subcategory) => subcategory.category!.id === +value
    );
    const options = subcategories.map((subcategory: Subcategory) => ({
      label: subcategory.name,
      value: subcategory.id,
    }));
    setSubcategoryOptions(options);
    setSelectedSubcategory(options[0]);
    setValue('subcategoryId', options[0].value);
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
      queryClient.invalidateQueries({
        queryKey: ['totalExpenses'],
      });
      queryClient.invalidateQueries({
        queryKey: ['logs'],
      });
      Toast.show({
        type: 'success',
        text1: 'Receipt saved',
        text2: 'Receipt was saved correctly',
      });
      clearImages();
      router.replace('/accounting/receipts/expense');
    },
  });

  const onSubmit = async (values: z.infer<typeof expenseSchema>) => {
    setIsFetching(true);
    await expenseMutation.mutateAsync();
    setIsFetching(false);
  };

  useFocusEffect(
    useCallback(() => {
      expenseQuery.refetch();
      if (expenseQuery.data) setExpenseData(expenseQuery.data);

      return () => {
        useCameraStore.getState().clearImages();
      };
    }, [])
  );

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

  const onDeleteReceipts = () => {
    Alert.alert(
      'Delete Receipt',
      'Are you sure you want to delete this receipt?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeExpense(expenseId);
              queryClient.invalidateQueries({
                queryKey: ['expenses', 'infinite'],
              });
              queryClient.invalidateQueries({
                queryKey: ['expense', expenseId],
              });
              queryClient.invalidateQueries({
                queryKey: ['totalExpenses'],
              });
              queryClient.invalidateQueries({
                queryKey: ['logs'],
              });
              Toast.show({
                type: 'success',
                text1: 'Receipt deleted',
                text2: 'Receipt was deleted correctly',
              });
              router.replace('/accounting/receipts/expense');
            } catch (error) {
              console.error(error);
              Toast.show({
                type: 'error',
                text1: 'Error deleting receipt',
                text2: 'There was an error deleting the receipt',
              });
            }
          },
        },
      ]
    );
  };

  const setExpenseData = (expense: Expense) => {
    setValue('merchant', expense.merchant);
    setValue('date', expense.date);
    setValue('total', expense.total);
    setValue('tax', expense.tax);
    setValue('notes', expense.notes ?? '');
    setValue('image', expense.image ? expense.image : undefined);
    expense.account && setValue('accountId', expense.account.id);
    expense.category && setValue('categoryId', expense.category.id);
    expense.subcategory && setValue('subcategoryId', expense.subcategory.id);

    setSelectedSubcategory(
      expense.subcategory
        ? {
            label: expense.subcategory?.name,
            value: expense.subcategory?.id.toString(),
          }
        : undefined
    );

    setSelectedCategory(
      expense.category && {
        label: expense.category.name,
        value: expense.category.id.toString(),
      }
    );

    setExpense(expense);
  };

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
    selectedImages,
    isFetching,
    onDeleteReceipts,
    selectedSubcategory,
    selectedCategory,
  };
};
