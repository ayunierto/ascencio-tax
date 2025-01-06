import { TextInput, type TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  className?: string;
  placeholderTextColor?: string;
}

export function Input({
  className,
  placeholderTextColor,
  ...props
}: InputProps) {
  return (
    <TextInput
      className={`border border-white h-12 px-5 color-white rounded-full ${className}`}
      placeholderTextColor={placeholderTextColor || '#ccc'}
      {...props}
    />
  );
}
