/* eslint-disable prettier/prettier */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import SignUp from './components/SignUp';
import {createStackNavigator} from '@react-navigation/stack';
import SignIn from './components/SignIn';
import Home from './components/Home';
import Welcome from './components/Welcome';
import auth from '@react-native-firebase/auth';
import AddProfile from './components/AddProfile';
import ProfileScreen from './components/ProfileScreen';

const Stack = createStackNavigator();
const user = auth().currentUser;

const App = () => {
  if (user) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="HOME"
            component={Home}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
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
          <Stack.Screen
            name="HOME"
            component={Home}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ADDPROFILE"
            component={AddProfile}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

export default App;
