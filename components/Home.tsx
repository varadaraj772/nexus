/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {BottomNavigation, Text} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import ProfileScreen from './ProfileScreen';
import HomeScreen from './HomeScreen';
import PostScreen from './PostScreen';
import SearchScreen from './SearchScreen';
import Welcome from './Welcome';

const ChatRoute = () => {
  return (
    <View style={styles.container}>
      <Text>Chat</Text>
    </View>
  );
};

export default function Home({navigation}) {
  useEffect(() => {
    const user = auth().currentUser;
    if (!user) {
      navigation.navigate('LOGIN');
    }
  }, []);

  const [index, setIndex] = React.useState(0);
  const [routes] = useState([
    {
      key: 'Home',
      title: 'HOME',
      focusedIcon: 'home',
      unfocusedIcon: 'home-outline',
    },
    {
      key: 'Search',
      title: 'SEARCH',
      focusedIcon: 'account-search',
      unfocusedIcon: 'account-search',
    },
    {
      key: 'Post',
      title: 'ADD POST',
      focusedIcon: 'plus-circle',
      unfocusedIcon: 'plus-circle-outline',
    },
    {
      key: 'Chat',
      title: 'CHAT',
      focusedIcon: 'message',
      unfocusedIcon: 'message-outline',
    },

    {
      key: 'Profile',
      title: 'PROFILE',
      focusedIcon: 'account-circle-outline',
      unfocusedIcon: 'account-circle',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    Home: HomeScreen,
    Search: SearchScreen,
    Post: PostScreen,
    Chat: ChatRoute,
    Profile: ProfileScreen,
    welcome: Welcome,
  });

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
