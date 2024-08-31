import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import BootSplash from 'react-native-bootsplash';

export default function App() {
  return (
    <AppNavigator
      onReady={() => {
        BootSplash.hide();
      }}
    />
  );
}
