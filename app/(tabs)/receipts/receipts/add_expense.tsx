import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import DateTimePicker from '@/presentation/theme/components/ui/DateTimePicker/DateTimePicker';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/presentation/theme/components/ui/Input';
import Select from '@/presentation/theme/components/ui/Select';
import { theme } from '../../../../presentation/theme/components/ui/Theme';
import {
  getCategories,
  getSubcategories,
  getAccounts,
} from '@/core/accounting/actions';
import Loader from '@/presentation/theme/components/Loader';
import { CategoryResponse } from '@/core/accounting/interfaces/categories-response';
import { SubcategoryResponse } from '@/core/accounting/interfaces';
import Button from '@/presentation/theme/components/ui/Button';
import { expenseSchema } from '@/core/accounting/schemas/expenseSchema';
import { SaveExpense } from '@/core/accounting/actions/save-expense';
import Toast from 'react-native-toast-message';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const AddExpense = () => {
  const [categoryOptions, setCategoryOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [accountOptions, setAccountOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [tax, setTax] = useState('');
  const [total, setTotal] = useState('');
  const [merchant, setMerchant] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {},
  });

  const categoryQuery = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
  const subcategoryQuery = useQuery({
    queryKey: ['subcategories'],
    queryFn: getSubcategories,
  });
  const accountQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  });

  useEffect(() => {
    if (categoryQuery.isSuccess) {
      const options = categoryQuery.data.map((cat: CategoryResponse) => ({
        label: cat.name,
        value: cat.id,
      }));
      setCategoryOptions(options);
    }
  }, [categoryQuery.isSuccess, categoryQuery.data]);

  useEffect(() => {
    if (accountQuery.isSuccess) {
      const options = accountQuery.data.map((acc: any) => ({
        label: acc.name,
        value: acc.id,
      }));
      setAccountOptions(options);
      setSelectedAccount(options[0].value);
      setValue('accountId', options[0].value);
    }
  }, [accountQuery.isSuccess, accountQuery.data]);

  const queryClient = useQueryClient();
  const { mutateAsync: mutate } = useMutation({
    mutationFn: async () => {
      const data = await SaveExpense({
        accountId: getValues('accountId'),
        categoryId: getValues('categoryId'),
        date: getValues('date'),
        merchant: getValues('merchant'),
        notes: '',
        subcategoryId: getValues('subcategoryId'),
        tax: +getValues('tax'),
        total: +getValues('total'),
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      reset({
        accountId: getValues('accountId'),
        categoryId: NaN,
        subcategoryId: NaN,
        date: '',
        merchant: '',
        // notes: '',
        tax: '',
        total: '',
      });
    },
  });

  const handleSaveExpense = async (values: z.infer<typeof expenseSchema>) => {
    console.warn(values);
    await mutate()
      .then((data) => {
        console.warn(data);
        if (data.id) {
          Toast.show({
            type: 'success',
            text1: 'Saved expense',
          });
          router.replace('/(tabs)/receipts/receipts');
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Something went wrong',
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (categoryQuery.isLoading || subcategoryQuery.isLoading) {
    return <Loader />;
  }

  if (categoryQuery.isError) {
    return <Text>Error loading categories</Text>;
  }

  if (subcategoryQuery.isError) {
    return <Text>Error loading subcategories</Text>;
  }

  const onChangeCategory = async (label: string, value: string) => {
    setSelectedCategory(value);
    setValue('categoryId', +value);
    const subcategories = subcategoryQuery.data.filter(
      (sub: SubcategoryResponse) => sub.category!.id === +value
    );
    const options = subcategories.map((sub: CategoryResponse) => ({
      label: sub.name,
      value: sub.id,
    }));
    setSubcategoryOptions(options);
  };

  const onChangeAccount = (label: string, value: string) => {
    setSelectedAccount(value);
    setValue('accountId', +value);
  };

  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 20, gap: 10 }}>
        <Text style={{ color: theme.muted }}>Merchant</Text>
        <Controller
          control={control}
          name="merchant"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Merchant"
              autoCapitalize="words"
            />
          )}
        />
        {errors.merchant && (
          <Text className="text-yellow-400">
            {errors.merchant?.message as string}
          </Text>
        )}

        <Text style={{ color: theme.muted }}>Date</Text>
        <DateTimePicker onChange={(date) => setValue('date', date)} />
        {errors.date && (
          <Text className="text-yellow-400">
            {errors.date?.message as string}
          </Text>
        )}

        <Text style={{ color: theme.muted }}>Total</Text>
        <Controller
          control={control}
          name="total"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="0.00"
              keyboardType="numeric"
            />
          )}
        />
        {errors.total && (
          <Text className="text-yellow-400">
            {errors.total?.message as string}
          </Text>
        )}

        <Text style={{ color: theme.muted }}>Tax</Text>
        <Controller
          control={control}
          name="tax"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="0.00"
              keyboardType="numeric"
            />
          )}
        />
        {errors.tax && (
          <Text className="text-yellow-400">
            {errors.tax?.message as string}
          </Text>
        )}

        <Text style={{ color: theme.muted }}>Account</Text>
        <Select
          enableFilter={false}
          options={accountOptions}
          onSelect={(item) => onChangeAccount(item!.label, item!.value)}
          placeholder="Select account"
          defaultSelected={accountOptions[0]}
          readOnly={true}
        />
        {errors.accountId && (
          <Text className="text-yellow-400">
            {errors.accountId?.message as string}
          </Text>
        )}

        <Text style={{ color: theme.muted }}>Category</Text>
        <Select
          enableFilter={false}
          options={categoryOptions}
          onSelect={(item) => onChangeCategory(item!.label, item!.value)}
          placeholder="Select category"
        />
        {errors.categoryId && (
          <Text className="text-yellow-400">
            {errors.categoryId?.message as string}
          </Text>
        )}

        {subcategoryOptions.length > 0 && (
          <>
            <Text style={{ color: theme.muted }}>Subcategory</Text>
            <Select
              enableFilter={false}
              options={subcategoryOptions}
              onSelect={(item) => setValue('subcategoryId', item!.value)}
              placeholder="Select subcategory"
            />
          </>
        )}
        <View style={{ marginTop: 20 }}>
          <Button
            iconRight={<Ionicons name="save-outline" size={24} color="white" />}
            onPress={handleSubmit(handleSaveExpense)}
          >
            Save
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddExpense;
