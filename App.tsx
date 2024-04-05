/* eslint-disable prettier/prettier */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import SignUp from './components/SignUp';
import {createStackNavigator} from '@react-navigation/stack';

import SignIn from './components/SignIn';
import Home from './components/Home';
import Welcome from './components/Welcome';
const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="WELCOME"
          component={Welcome}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CREATE ACCOUNT"
          component={SignUp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LOGIN"
          component={SignIn}
          options={{headerShown: false}}
        />
        <Stack.Screen name="HOME" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
