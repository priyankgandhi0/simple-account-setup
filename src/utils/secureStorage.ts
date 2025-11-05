import * as Keychain from 'react-native-keychain';
import { STORAGE_KEYS } from './constants';

export const saveCredentials = async (
  username: string,
  password: string
): Promise<boolean> => {
  try {
    await Keychain.setGenericPassword(username, password, {
      service: 'com.accountsetup.credentials',
    });
    return true;
  } catch (error) {
    console.error('Failed to save credentials:', error);
    return false;
  }
};

export const getCredentials = async (): Promise<{
  username: string;
  password: string;
} | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: 'com.accountsetup.credentials',
    });
    if (credentials) {
      return {
        username: credentials.username,
        password: credentials.password,
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to get credentials:', error);
    return null;
  }
};

export const deleteCredentials = async (): Promise<boolean> => {
  try {
    await Keychain.resetGenericPassword({
      service: 'com.accountsetup.credentials',
    });
    return true;
  } catch (error) {
    console.error('Failed to delete credentials:', error);
    return false;
  }
};

export const saveSessionToken = async (token: string): Promise<boolean> => {
  try {
    await Keychain.setGenericPassword('session', token, {
      service: 'com.accountsetup.session',
    });
    return true;
  } catch (error) {
    console.error('Failed to save session:', error);
    return false;
  }
};

export const getSessionToken = async (): Promise<string | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: 'com.accountsetup.session',
    });
    return credentials ? credentials.password : null;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
};

export const deleteSessionToken = async (): Promise<boolean> => {
  try {
    await Keychain.resetGenericPassword({
      service: 'com.accountsetup.session',
    });
    return true;
  } catch (error) {
    console.error('Failed to delete session:', error);
    return false;
  }
};