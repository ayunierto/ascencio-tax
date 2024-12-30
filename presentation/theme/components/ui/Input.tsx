import { TextInput, type TextInputProps, StyleSheet } from 'react-native';

export type InputProps = TextInputProps & {};

export function Input({ style, ...props }: InputProps) {
  return <TextInput style={[styles.input, style]} {...props} />;
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

    // flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
  },
});
