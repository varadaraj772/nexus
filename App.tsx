import React, {useEffect, useState} from 'react';
import AppNavigator from './navigation/AppNavigator';
import BootSplash from 'react-native-bootsplash';
import {Provider as PaperProvider} from 'react-native-paper';
import {ThemeProvider, ThemeContext} from './screens/ThemeContext';
import ReactNativeBiometrics from 'react-native-biometrics';
import {Alert} from 'react-native';

export default function App() {
  const [biometrics, setBiometrics] = useState(false);
  const handleBiometricAuth = async () => {
    try {
      const rnBiometrics = new ReactNativeBiometrics();
      const {success, error} = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate to continue',
      });

      if (success) {
        setBiometrics(true);
        return true;
      } else {
        console.log(error);
        Alert.alert('Authentication failed', 'Biometric authentication failed');
        return false;
      }
    } catch (error) {
      console.error('[handleBiometricAuth] Error:', error);
      Alert.alert('Error', 'Biometric authentication failed from device');
      return false;
    }
  };
  useEffect(() => {
    handleBiometricAuth();
  }, []);
  return (
    <ThemeProvider>
      <ThemeContext.Consumer>
        {({theme}) => (
          <PaperProvider theme={theme}>
            <AppNavigator
              onReady={() => biometrics && BootSplash.hide()}
              biometrics={biometrics}
            />
          </PaperProvider>
        )}
      </ThemeContext.Consumer>
    </ThemeProvider>
  );
}
