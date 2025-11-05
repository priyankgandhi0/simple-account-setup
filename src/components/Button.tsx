import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { colors } from '../constants/colors';
import { fontSize } from '../constants/spacing';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  loading = false,
  variant = 'primary',
  disabled,
  ...touchableProps
}) => {
  const getButtonStyle = () => {
    if (disabled || loading) {
      return [styles.button, styles.buttonDisabled];
    }
    switch (variant) {
      case 'secondary':
        return [styles.button, styles.buttonSecondary];
      case 'outline':
        return [styles.button, styles.buttonOutline];
      default:
        return [styles.button, styles.buttonPrimary];
    }
  };

  const getTextStyle = () => {
    if (disabled || loading) {
      return [styles.text, styles.textDisabled];
    }
    switch (variant) {
      case 'outline':
        return [styles.text, styles.textOutline];
      default:
        return [styles.text, styles.textPrimary];
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
      {...touchableProps}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(24),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: verticalScale(48),
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
  },
  text: {
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  textPrimary: {
    color: colors.white,
  },
  textOutline: {
    color: colors.primary,
  },
  textDisabled: {
    color: colors.white,
  },
});