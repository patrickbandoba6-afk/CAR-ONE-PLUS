import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './src/i18n';
import { AppStateProvider } from './src/context/AppStateContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
