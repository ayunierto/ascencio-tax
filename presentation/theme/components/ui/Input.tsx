import { TextInput, type TextInputProps, StyleSheet } from 'react-native';

export type InputProps = TextInputProps & {
  className?: string;
};

export function Input({ style, className, ...props }: InputProps) {
  return (
    <TextInput
      className={`border border-white py-4 px-5 color-white  rounded-full  ${className}`}
      placeholderTextColor={'#ccc'}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderColor: 'white',
    borderWidth: 1,
    paddingHorizontal: 20,
    borderRadius: 30,
    fontSize: 16,
    color: 'white',
    height: 50,
  },
});
