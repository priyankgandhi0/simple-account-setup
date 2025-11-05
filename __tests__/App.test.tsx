import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import App from "../App";

// Mock Navigation
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: any) => children,
}));
jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }: any) => children,
    Screen: () => null,
  }),
}));

// Mock Keychain behavior globally (since App loads session on startup)
jest.mock("react-native-keychain", () => ({
  getGenericPassword: jest.fn(async () => false),
  setGenericPassword: jest.fn(async () => true),
  resetGenericPassword: jest.fn(async () => true),
}));

test("App renders without crashing", async () => {
  const screen = render(<App />);

  // Wait for auth store to finish async session check
  await waitFor(() => {
    expect(screen.toJSON()).toBeTruthy();
  });
});


