import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ChatScreen from '../screens/ChatScreen';
import DetailedChatScreen from '../screens/DetailedChatScreen';

const Stack = createStackNavigator();

export default function ChatStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatS"
        component={ChatScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DetailedChat"
        component={DetailedChatScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
