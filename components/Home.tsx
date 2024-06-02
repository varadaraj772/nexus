/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileScreen from './ProfileScreen';
import HomeScreen from './HomeScreen';
import PostScreen from './PostScreen';
import SearchScreen from './SearchScreen';
import ChatScreen from './ChatScreen';
import DetailedChatScreen from './DetailedChatScreen';
import auth from '@react-native-firebase/auth';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabNavigator = ({navigation}) => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'account-search' : 'account-search-outline';
          } else if (route.name === 'Post') {
            iconName = focused ? 'plus-circle' : 'plus-circle-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'message' : 'message-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account-circle' : 'account-circle-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 10,
        },
        tabBarItemStyle: ({focused}) => ({
          backgroundColor: focused ? 'purple' : 'white',
          borderRadius: 25,
          margin: 5,
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          marginBottom: 5,
        },
        tabBarShowLabel: true,
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Post"
        component={PostScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Chat"
        component={ChatStackNavigator} // Use the nested stack navigator for the Chat tab
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

const ChatStackNavigator = () => {
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
};

export default MainTabNavigator;
