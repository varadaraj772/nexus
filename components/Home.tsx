/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import {BottomNavigation, Text} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
const PostRoute = () => {
  return (
    <View style={styles.container}>
      <Text>Posts</Text>
    </View>
  );
};

const StatusRoute = () => {
  return (
    <View style={styles.container}>
      <Text>Status</Text>
    </View>
  );
};

const MessageRoute = () => {
  return (
    <View style={styles.container}>
      <Text>Messages</Text>
    </View>
  );
};

const CallRoute = () => {
  return (
    <View style={styles.container}>
      <Text>Calls</Text>
    </View>
  );
};
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
      key: 'Posts',
      title: 'Posts',
      focusedIcon: 'music',
      unfocusedIcon: 'home',
    },
    {key: 'Status', title: 'Status', focusedIcon: 'album'},
    {key: 'Message', title: 'Message', focusedIcon: 'history'},
    {
      key: 'Call',
      title: 'Call',
      focusedIcon: 'bell',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    Posts: PostRoute,
    Status: StatusRoute,
    Message: MessageRoute,
    Call: CallRoute,
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
