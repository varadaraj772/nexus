import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import BootSplash from 'react-native-bootsplash';
import {Provider as PaperProvider} from 'react-native-paper';
import {ThemeProvider, ThemeContext} from './screens/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <ThemeContext.Consumer>
        {({theme}) => (
          <PaperProvider theme={theme}>
            <AppNavigator
              onReady={() => {
                BootSplash.hide();
              }}
            />
          </PaperProvider>
        )}
      </ThemeContext.Consumer>
    </ThemeProvider>
  );
}
