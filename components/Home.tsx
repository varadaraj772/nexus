/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import {BottomNavigation, Text} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import ProfileScreen from './ProfileScreen';
import HomeScreen from './HomeScreen';
/*const HomeRoute = () => {
  return (
    <View style={styles.container}>
      <Text>Home </Text>
    </View>
  );
};*/

const SearchRoute = () => {
  return (
    <View style={styles.container}>
      <Text>Search</Text>
    </View>
  );
};

const PostRoute = () => {
  return (
    <View style={styles.container}>
      <Text>Posts</Text>
    </View>
  );
};

const ChatRoute = () => {
  return (
    <View style={styles.container}>
      <Text>Chat</Text>
    </View>
  );
};
/*const ProfileRoute = () => {
  return (
    <View style={styles.container}>
      <Text>Profile</Text>
    </View>
  );
};*/
export default function Home() {
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  }
  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('TOKEN---------', token);
  };
  useEffect(() => {
    requestUserPermission();
    getToken();
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
    Search: SearchRoute,
    Post: PostRoute,
    Chat: ChatRoute,
    Profile: ProfileScreen,
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
