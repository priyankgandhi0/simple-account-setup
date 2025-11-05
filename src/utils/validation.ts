import { VALIDATION_RULES, ERROR_MESSAGES } from './constants';

export const validateEmail = (email: string): string | undefined => {
  if (!email || email.trim() === '') {
    return ERROR_MESSAGES.REQUIRED;
  }
  if (!VALIDATION_RULES.EMAIL_REGEX.test(email)) {
    return ERROR_MESSAGES.EMAIL_INVALID;
  }
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password || password.trim() === '') {
    return ERROR_MESSAGES.REQUIRED;
  }
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return ERROR_MESSAGES.PASSWORD_WEAK;
  }
  if (!VALIDATION_RULES.PASSWORD_REGEX.test(password)) {
    return ERROR_MESSAGES.PASSWORD_WEAK;
  }
  return undefined;
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string | undefined => {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return ERROR_MESSAGES.REQUIRED;
  }
  if (password !== confirmPassword) {
    return ERROR_MESSAGES.PASSWORD_MISMATCH;
  }
  return undefined;
};

export const validateRequired = (value: string): string | undefined => {
  if (!value || value.trim() === '') {
    return ERROR_MESSAGES.REQUIRED;
  }
  return undefined;
};

export const validatePhone = (phone: string): string | undefined => {
  if (!phone || phone.trim() === '') {
    return ERROR_MESSAGES.REQUIRED;
  }
  if (!VALIDATION_RULES.PHONE_REGEX.test(phone)) {
    return ERROR_MESSAGES.PHONE_INVALID;
  }
  return undefined;
};

export const validateName = (name: string): string | undefined => {
  if (!name || name.trim() === '') {
    return ERROR_MESSAGES.REQUIRED;
  }
  if (!VALIDATION_RULES.NAME_REGEX.test(name)) {
    return ERROR_MESSAGES.NAME_INVALID;
  }
  return undefined;
};