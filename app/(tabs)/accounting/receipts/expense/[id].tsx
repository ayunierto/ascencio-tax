import React from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';

import { Redirect, useLocalSearchParams } from 'expo-router';
import { Input } from '@/presentation/theme/components/ui/Input';
import { useExpense } from '@/core/accounting/expenses/hooks/useExpense';
import Loader from '@/presentation/theme/components/Loader';
import { theme } from '@/presentation/theme/components/ui/Theme';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/presentation/theme/components/ui/Button';
import Select from '@/presentation/theme/components/ui/Select';
import DateTimePicker from '@/presentation/theme/components/ui/DateTimePicker/DateTimePicker';
import { Controller } from 'react-hook-form';
import { Account } from '@/core/accounting/accounts/interfaces';
import ExpenseImage from '@/presentation/theme/components/receipts/expenses/ExpenseImage';
import ErrorMessage from '@/presentation/theme/components/receipts/expenses/ErrorMessage';
import { useCameraStore } from '@/core/camera/store';

const ExpenseScreen = () => {
  const { id } = useLocalSearchParams();
  console.warn({ ExpenseScreenID: +id });
  const {
    expense,
    expenseQuery,
    accountQuery,
    categoryOptions,
    subcategoryOptions,
    onChangeCategory,
    onSubmit,
    control,
    handleSubmit,
    setValue,
    errors,
    isLoading,
  } = useExpense(+id);

  const { selectedImages } = useCameraStore();

  if (isLoading) return <Loader />;

  if (!expenseQuery.data) {
    return <Redirect href={'/accounting/receipts/expense'} />;
  }

  return (
    <KeyboardAvoidingView behavior="padding">
      <ScrollView>
        <View style={{ margin: 20, gap: 10 }}>
          {/* <ThemedText>Receipt image:</ThemedText> */}
          <ExpenseImage
            onChange={(image) => setValue('image', image)}
            image={
              selectedImages.length > 0
                ? selectedImages[0]
                : expense
                ? expense.image
                : null
            }
          />

          <Controller
            control={control}
            name={'merchant'}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Merchant"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <ErrorMessage fieldErrors={errors.merchant} />

          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, onBlur, value } }) => (
              <DateTimePicker value={new Date(value)} onChange={onChange} />
            )}
          />
          <ErrorMessage fieldErrors={errors.date} />

          <Controller
            control={control}
            name="total"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Total"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
          <ErrorMessage fieldErrors={errors.total} />

          <Controller
            control={control}
            name="tax"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Tax"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
              />
            )}
          />
          <ErrorMessage fieldErrors={errors.tax} />

          <Controller
            control={control}
            name="accountId"
            render={({ field: { onChange, onBlur, value } }) => (
              <Select
                enableFilter={false}
                options={
                  accountQuery.data?.map((account: Account) => ({
                    label: account.name,
                    value: account.id.toString(),
                  })) ?? []
                }
                placeholder="Account"
                selectedOptions={
                  expense &&
                  expense.account && {
                    label: expense.account.name,
                    value: expense.account.id.toString(),
                  }
                }
                onSelect={(selectedAccount) => {
                  setValue('accountId', +selectedAccount.value);
                }}
              />
            )}
          />
          <ErrorMessage fieldErrors={errors.accountId} />

          <Controller
            control={control}
            name="categoryId"
            render={({ field: { onChange, onBlur, value } }) => (
              <Select
                enableFilter={false}
                options={categoryOptions}
                placeholder="Category"
                selectedOptions={
                  expense &&
                  expense.category && {
                    label: expense.category.name,
                    value: expense.category.id.toString(),
                  }
                }
                onSelect={(option) => {
                  onChangeCategory(option.label, option.value);
                  setValue('categoryId', +option.value);
                }}
              />
            )}
          />
          <ErrorMessage fieldErrors={errors.categoryId} />

          {subcategoryOptions.length > 0 && (
            <>
              <Controller
                control={control}
                name="subcategoryId"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Select
                    enableFilter={false}
                    options={subcategoryOptions}
                    placeholder="Subcategory"
                    selectedOptions={
                      expense && expense.subcategory
                        ? {
                            label: expense.subcategory?.name,
                            value: expense.subcategory?.id.toString(),
                          }
                        : undefined
                    }
                    onSelect={(option) =>
                      setValue('subcategoryId', +option.value)
                    }
                  />
                )}
              />
              <ErrorMessage fieldErrors={errors.subcategoryId} />
            </>
          )}

          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Notes"
                multiline
                numberOfLines={5}
                style={{ height: 'auto', minHeight: 48 }}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <ErrorMessage fieldErrors={errors.notes} />

          <Button
            onPress={handleSubmit(onSubmit)}
            loading={expenseQuery.isFetching}
            disabled={expenseQuery.isFetching}
            iconRight={
              <Ionicons
                name="save-outline"
                size={24}
                color={theme.foreground}
              />
            }
          >
            Save
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ExpenseScreen;
