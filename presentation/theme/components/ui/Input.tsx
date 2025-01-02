import { TextInput, type TextInputProps } from 'react-native';

export type InputProps = TextInputProps & {
  className?: string;
};

export function Input({ className, ...props }: InputProps) {
  return (
    <TextInput
      className={`border border-white h-12 px-5 color-white rounded-full ${className}`}
      placeholderTextColor={'#ccc'}
      {...props}
    />
  );
}
