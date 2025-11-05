import React, {forwardRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { colors } from '../constants/colors';
import { fontSize } from '../constants/spacing';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  ref?: React.RefObject<TextInput>;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, required = false, rightIcon, onRightIconPress, ...textInputProps }, ref) => {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>

        <View style={[styles.inputContainer, error && styles.inputContainerError]}>
          <TextInput
            ref={ref} 
            style={styles.input}
            placeholderTextColor={colors.textSecondary}
            {...textInputProps}
          />

          {rightIcon && (
            <TouchableOpacity onPress={onRightIconPress} style={styles.rightIconContainer}>
              {rightIcon}
            </TouchableOpacity>
          )}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(16),
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text,
    marginBottom: verticalScale(8),
  },
  required: {
    color: colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: moderateScale(8),
    backgroundColor: colors.white,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    fontSize: fontSize.md,
    color: colors.text,
  },
  rightIconContainer: {
    paddingHorizontal: scale(12),
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
    marginTop: verticalScale(4),
  },
});