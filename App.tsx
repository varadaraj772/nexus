/* eslint-disable prettier/prettier */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import SignUp from './components/SignUp';
import {createStackNavigator} from '@react-navigation/stack';

import SignIn from './components/SignIn';
import Home from './components/Home';
const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="CREATE ACCOUNT" component={SignUp} />
        <Stack.Screen name="LOGIN" component={SignIn} />
        <Stack.Screen name="HOME" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
