import { useCallback, useEffect, useState } from 'react';

import { router, useFocusEffect, useNavigation } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Category } from '../../categories/interfaces/category.interface';
import { expenseSchema } from '../schemas/expenseSchema';
import { getAccounts } from '../../accounts/actions';
import { getCategories } from '../../categories/actions';
import { getSubcategories } from '../../subcategories/actions';
import { Subcategory } from '../../subcategories/interfaces';
import { createExpense } from '../actions';
import { CreateUpdateExpense, Expense } from '../interfaces';
import { useCameraStore } from '@/core/camera/store';

interface Option {
  label: string;
  value: string;
}

export const useCreateExpense = () => {
  const navigation = useNavigation();
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState<Option[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Option>();
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { selectedImages, clearImages } = useCameraStore();

  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString(),
    },
  });

  useFocusEffect(
    useCallback(() => {
      // Implementation when Focus is made
      return () => {
        clearImages();
      };
    }, [])
  );

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
    if (categoryQuery.isSuccess) {
      const options = categoryQuery.data.map((category: Category) => ({
        label: category.name,
        value: category.id.toString(),
      }));
      setCategoryOptions(options);
    }
  }, [categoryQuery.isSuccess, categoryQuery.data]);

  // useEffect(() => {
  //   if (subcategoryQuery.isSuccess) {
  //     const options = subcategoryQuery.data.map((subcategory: Subcategory) => ({
  //       label: subcategory.name,
  //       value: subcategory.id,
  //     }));
  //     setSubcategoryOptions(options);
  //   }
  // }, [subcategoryQuery.isSuccess, subcategoryQuery.data]);

  const onChangeCategory = async (categoryId: string) => {
    setValue('categoryId', categoryId);

    if (subcategoryQuery.data) {
      const subcategories = subcategoryQuery.data.filter(
        (subcategory: Subcategory) => subcategory.category!.id === categoryId
      );
      const options = subcategories.map((subcategory: Subcategory) => ({
        label: subcategory.name,
        value: subcategory.id,
      }));
      setSubcategoryOptions(options);
      setSelectedSubcategory(options[0]);
      setValue('subcategoryId', options[0].value);
    }
  };

  const expenseMutation = useMutation({
    mutationFn: async (values: CreateUpdateExpense): Promise<Expense> => {
      const image = getValues('image');
      const data = await createExpense({
        image: image && image.includes('file') ? image : undefined,
        ...values,
      });
      return data;
    },

    onSuccess: async (data: Expense) => {
      await queryClient.invalidateQueries({
        queryKey: ['expenses', 'infinite'],
      });

      // For dashboard
      await queryClient.invalidateQueries({
        queryKey: ['totalExpenses'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['logs'],
      });

      Toast.show({
        type: 'success',
        text1: `Receipt ${data.merchant} saved`,
        text2: 'Receipt was saved correctly',
      });
      clearImages();
      router.replace('/accounting/receipts/expense');
    },
  });

  const onSubmit = async (values: z.infer<typeof expenseSchema>) => {
    setIsFetching(true);
    await expenseMutation.mutateAsync({
      ...values,
      total: +values.total,
      tax: +values.tax,
    });
    setIsFetching(false);
  };

  return {
    accountQuery,
    categoryQuery,
    subcategoryQuery,
    categoryOptions,
    subcategoryOptions,
    control,
    errors,
    setValue,
    handleSubmit,
    onChangeCategory,
    onSubmit,
    selectedImages,
    isFetching,
    selectedSubcategory,
    watch,
    navigation,
  };
};
