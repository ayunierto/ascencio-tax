import { View, Text, type ViewProps } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface AlertProps extends ViewProps {
  type: 'info' | 'warning' | 'error' | 'success';
}

const Alert = ({ type, children, ...props }: AlertProps) => {
  return (
    <View
      className={`${
        type === 'info'
          ? 'bg-blue-500'
          : type === 'warning'
          ? 'bg-orange-500'
          : type === 'success'
          ? 'bg-green-500'
          : 'bg-red-500'
      } py-2 px-5 rounded-xl opacity-80 flex flex-row items-center justify-center gap-2`}
      {...props}
    >
      <Ionicons
        name={
          type === 'info'
            ? 'information-circle-outline'
            : type === 'warning'
            ? 'warning-outline'
            : type === 'success'
            ? 'checkmark-circle-outline'
            : 'alert-circle-outline'
        }
        size={24}
        color="white"
        className="ml-5"
      />
      <Text numberOfLines={3} className="text-white mr-5">
        {children}
      </Text>
    </View>
  );
};

export default Alert;
