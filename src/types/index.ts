export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  dateOfBirth: string;
  address: string;
  city: string;
  zipCode: string;
}

export interface RegistrationFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  dateOfBirth: string;
  address: string;
  city: string;
  zipCode: string;
}

export interface LoginFormData {
  emailOrUsername: string;
  password: string;
}

export interface Country {
  code: string;
  name: string;
  dialCode: string;
}