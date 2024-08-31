/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import {FAB, Text} from 'react-native-paper';
import {StyleSheet, View, Image, StatusBar} from 'react-native';
import auth from '@react-native-firebase/auth';

export default function Welcome({navigation}) {
  const user = auth().currentUser;
  useEffect(() => {
    if (user) {
      return navigation.navigate('Home');
    }
    StatusBar.setBackgroundColor('#0c0c0c');
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.jpg')} style={styles.logo} />
      </View>
      <View style={styles.contentContainer}>
        <Text variant="displayLarge">WELCOME TO NEXUS</Text>
        <View style={styles.buttonContainer}>
          <FAB
            label="SIGN IN"
            onPress={() => navigation.navigate('SignIn')}
            style={styles.button}
          />
          <FAB
            label="SIGN UP"
            onPress={() => navigation.navigate('SignUp')}
            style={styles.button}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fcf5ff',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 460,
    height: 460,
    resizeMode: 'contain',
    borderRadius: 100,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  buttonContainer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
  },
  button: {
    width: '50%',
    margin: 5,
  },
});
