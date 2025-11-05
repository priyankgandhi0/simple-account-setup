import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateRequired,
  validatePhone,
  validateName,
} from "../src/utils/validation";

import { ERROR_MESSAGES } from "../src/utils/constants";

describe("Validation Tests", () => {
  // EMAIL
  test("should return REQUIRED for empty email", () => {
    expect(validateEmail("")).toBe(ERROR_MESSAGES.REQUIRED);
  });

  test("should return EMAIL_INVALID for incorrect email format", () => {
    expect(validateEmail("test@com")).toBe(ERROR_MESSAGES.EMAIL_INVALID);
  });

  test("should return undefined for valid email", () => {
    expect(validateEmail("test@example.com")).toBeUndefined();
  });

  // PASSWORD
  test("should return REQUIRED for empty password", () => {
    expect(validatePassword("")).toBe(ERROR_MESSAGES.REQUIRED);
  });

  test("should return PASSWORD_WEAK for password shorter than minimum length", () => {
    expect(validatePassword("Pass1@")).toBe(ERROR_MESSAGES.PASSWORD_WEAK);
  });

  test("should return PASSWORD_WEAK for password missing uppercase/special/number", () => {
    expect(validatePassword("password123")).toBe(ERROR_MESSAGES.PASSWORD_WEAK);
  });

  test("should return undefined for strong password", () => {
    expect(validatePassword("Pass@123")).toBeUndefined();
  });

  // CONFIRM PASSWORD
  test("should return REQUIRED if confirm password is empty", () => {
    expect(validateConfirmPassword("Pass@123", "")).toBe(ERROR_MESSAGES.REQUIRED);
  });

  test("should return PASSWORD_MISMATCH if passwords don't match", () => {
    expect(validateConfirmPassword("Pass@123", "Pass@12")).toBe(ERROR_MESSAGES.PASSWORD_MISMATCH);
  });

  test("should return undefined if both passwords match", () => {
    expect(validateConfirmPassword("Pass@123", "Pass@123")).toBeUndefined();
  });

  // REQUIRED
  test("should return REQUIRED for empty value", () => {
    expect(validateRequired("")).toBe(ERROR_MESSAGES.REQUIRED);
  });

  test("should return undefined for non-empty value", () => {
    expect(validateRequired("Hello")).toBeUndefined();
  });

  // PHONE
  test("should return REQUIRED for empty phone number", () => {
    expect(validatePhone("")).toBe(ERROR_MESSAGES.REQUIRED);
  });

  test("should return PHONE_INVALID for incorrect phone format", () => {
    expect(validatePhone("abc123")).toBe(ERROR_MESSAGES.PHONE_INVALID);
  });

  test("should return undefined for valid phone number", () => {
    expect(validatePhone("+91 9876543210")).toBeUndefined();
  });

  // NAME
  test("should return REQUIRED for empty name", () => {
    expect(validateName("")).toBe(ERROR_MESSAGES.REQUIRED);
  });

  test("should return NAME_INVALID for invalid name format", () => {
    expect(validateName("John123")).toBe(ERROR_MESSAGES.NAME_INVALID);
  });

  test("should return undefined for valid name", () => {
    expect(validateName("John Doe")).toBeUndefined();
  });
});
