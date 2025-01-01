import { TextInput, type TextInputProps } from 'react-native';

export type InputProps = TextInputProps & {
  className?: string;
};

export function Input({ style, className, ...props }: InputProps) {
  return (
    <TextInput
      className={`border border-white py-4 px-5 color-white rounded-full ${className}`}
      placeholderTextColor={'#ccc'}
      {...props}
    />
  );
}
