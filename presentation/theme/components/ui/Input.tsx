import {
  StyleProp,
  TextInput,
  TextStyle,
  type TextInputProps,
} from 'react-native';
import { theme } from './Theme';
import { useRef, useState } from 'react';

interface InputProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
  placeholderTextColor?: string;
  focusedBorderColor?: string; // Add a prop for the focused border color
}

export function Input({
  placeholderTextColor,
  focusedBorderColor = theme.primary,
  style,
  readOnly,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  console.warn({ isFocused });

  return (
    <TextInput
      ref={inputRef}
      style={[
        {
          borderWidth: 1,
          borderColor: readOnly
            ? theme.mutedForeground
            : isFocused
            ? focusedBorderColor
            : theme.input, // Conditional border color
          borderRadius: theme.radius,
          paddingHorizontal: 20,
          height: 48,
          color: readOnly ? theme.mutedForeground : theme.primaryForeground,
        },
        style,
      ]}
      onFocus={() => setIsFocused(true)}
      onEndEditing={() => setIsFocused(false)}
      placeholderTextColor={placeholderTextColor || '#ccc'}
      readOnly={readOnly}
      {...props}
    />
  );
}
