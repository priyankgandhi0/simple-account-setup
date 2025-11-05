module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  // setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  moduleNameMapper: {
    '@react-native-async-storage/async-storage':
      '@react-native-async-storage/async-storage/jest/async-storage-mock',

    'react-native-keychain': '<rootDir>/__mocks__/react-native-keychain.ts',
    'src/store/authStore': '<rootDir>/__mocks__/authStore.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native' +
      '|@react-native' +
      '|@react-navigation' +
      '|react-native-reanimated' +
      '|react-native-size-matters' +
      ')/)',
  ],
};
