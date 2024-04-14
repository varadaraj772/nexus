/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; // Import for user ID

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const user = auth().currentUser; // Get the current user
 // console.log(user);
  // Handle potential errors during data fetching
  const handleError = error => {
    console.error('Error fetching user data:', error);
    // Optionally display an error message to the user
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
  }, [user]); // Dependency on user object

  if (!userData) {
    return <Text>Loading profile data...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>Name: {userData.FullName}</Text>
      <Text>Email: {userData.Email}</Text>
      <Text>Username: {userData.UserName}</Text>
      {/* Display other user details as needed */}
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
