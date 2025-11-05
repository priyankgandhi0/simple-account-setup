import React, { useEffect } from 'react';
import { StatusBar, View, ActivityIndicator, StyleSheet } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { colors } from './src/constants/colors';
import { useAuthStore } from './src/store/authStore';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const App: React.FC = () => {
  const { checkSession, isLoading } = useAuthStore();

  useEffect(() => {
    // Check for existing session when app starts
    checkSession();
  }, [checkSession]);

  // Show loading screen while checking session
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background}
        />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background}
        />
        <AppNavigator />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default App;
