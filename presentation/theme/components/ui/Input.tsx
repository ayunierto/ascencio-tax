import { TextInput, type TextInputProps, StyleSheet } from 'react-native';

export type InputProps = TextInputProps & {};

export function Input({ style, ...props }: InputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      {...props}
      placeholderTextColor={'#CCCCCC'}
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
