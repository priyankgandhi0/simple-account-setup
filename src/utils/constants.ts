export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s-()]+$/,
  NAME_REGEX: /^[a-zA-Z\s'-]+$/,
  ZIP_CODE_REGEX: /^[A-Z0-9\s-]+$/i,
};

export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_WEAK: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
  PASSWORD_MISMATCH: 'Passwords do not match',
  PHONE_INVALID: 'Please enter a valid phone number',
  NAME_INVALID: 'Please enter a valid name',
  ZIP_CODE_INVALID: 'Please enter a valid ZIP code',
  LOGIN_FAILED: 'Invalid email/username or password',
  ACCOUNT_LOCKED: 'Account locked due to too many failed attempts. Try again later.',
};

export const STORAGE_KEYS = {
  USER_DATA: '@user_data',
  SESSION_TOKEN: '@session_token',
  REGISTRATION_DRAFT: '@registration_draft',
  FAILED_LOGIN_ATTEMPTS: '@failed_login_attempts',
};

export const MAX_LOGIN_ATTEMPTS = 5;