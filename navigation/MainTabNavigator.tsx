/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PostScreen from '../screens/PostScreen';
import SearchScreen from '../screens/SearchScreen';
import ChatStackNavigator from './ChatStackNavigator';
import {useTheme} from 'react-native-paper';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const {colors} = useTheme();
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
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'black',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          height: 60,
          padding: 10,
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
        options={{headerShown: false, headerTitle: 'NEXUS'}}
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
        component={ChatStackNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}
