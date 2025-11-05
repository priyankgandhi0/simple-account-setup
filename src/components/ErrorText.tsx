import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { fontSize } from '../constants/spacing';
import { colors } from '../constants/colors';

interface ErrorTextProps {
  message?: string;
}

export const ErrorText: React.FC<ErrorTextProps> = ({ message }) => {
  if (!message) return null;

  return (
    <Text style={styles.error} accessibilityRole="alert">
      {message}
    </Text>
  );
};

const styles = StyleSheet.create({
  error: {
    fontSize: fontSize.sm,
    color: colors.error,
    textAlign: 'center',
    marginVertical: 8,
  },
});