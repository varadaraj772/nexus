/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, SafeAreaView} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {ActivityIndicator, Avatar, Button, Divider} from 'react-native-paper';

const ProfileScreen = props => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = auth().currentUser;

  const handleError = error => {
    console.error('Error fetching user data:', error);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const docRef = firestore().collection('users').doc(user.uid);

          const docSnapshot = await docRef.get();
          if (docSnapshot.exists) {
            setUserData(docSnapshot.data());
          } else {
            console.log('No user data found');
          }
        } catch (error) {
          handleError(error);
        } finally {
          setIsLoading(false);
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

  const SignOut = () => {
    auth().signOut();
    props.jumpTo('Home');
  };

  const imgData = userData?.imageurl && {uri: userData.imageurl};

  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        {isLoading ? (
          <ActivityIndicator animating={true} size={'small'} />
        ) : (
          <Avatar.Image size={200} source={imgData} />
        )}
      </View>
      <View style={styles.userDetailsContainer}>
        <Divider />
        <Text style={styles.detailText}>Name: {userData.FullName}</Text>
        <Divider />
        <Text style={styles.detailText}>Email: {userData.Email}</Text>
        <Divider />
        <Text style={styles.detailText}>Username: {userData.UserName}</Text>
        <Divider />
        <Text style={styles.detailText}>
          Mobile Number: {userData.MobileNo}
        </Text>
        <Divider />
      </View>
      <Button mode="text" onPress={SignOut} style={styles.signOutButton}>
        SIGNOUT
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userDetailsContainer: {
    marginBottom: 20,
  },
  detailText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 5,
  },
});
export default ProfileScreen;
