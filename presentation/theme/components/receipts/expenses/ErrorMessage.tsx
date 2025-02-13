import React from 'react';

import { ThemedText } from '../../ui/ThemedText';
import { theme } from '../../ui/Theme';

interface ErrorMessageProps {
  fieldErrors: any;
}

const ErrorMessage = ({ fieldErrors }: ErrorMessageProps) => {
  return (
    <>
      {fieldErrors && (
        <ThemedText style={{ color: theme.destructive }}>
          {fieldErrors?.message}
        </ThemedText>
      )}
    </>
  );
};

export default ErrorMessage;
