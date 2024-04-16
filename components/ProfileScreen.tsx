/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, SafeAreaView} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {ActivityIndicator, Avatar, Button} from 'react-native-paper';
import SignIn from './SignIn';

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const user = auth().currentUser;
  const handleError = error => {
    console.error('Error fetching user data:', error);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const docRef = firestore().collection('users').doc(user.uid);
          const docSnapshot = await docRef.get();
          console.log(docSnapshot.data);
          if (docSnapshot.exists) {
            setUserData(docSnapshot.data());
          } else {
            console.log('No user data found');
          }
        } catch (error) {
          handleError(error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator animating={true} size={'large'} />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Avatar.Text size={100} label="V" />
      <Text>Name: {userData.FullName}</Text>
      <Text>Email: {userData.Email}</Text>
      <Text>Username: {userData.UserName}</Text>
      <Text>Mobile Number: {userData.MobileNo}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfileScreen;
