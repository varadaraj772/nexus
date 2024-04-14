/* eslint-disable prettier/prettier */
import {StyleSheet, SafeAreaView, StatusBar, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import {
  PaperProvider,
  TextInput,
  Button,
  Dialog,
  Portal,
  Text,
} from 'react-native-paper';
import {Image} from 'react-native';

const theme = {
  colors: {
    primary: '#F08080',
    secondary: '#3F51B5',
    background: '#F5F5F5',
  },
};
const onGoogleButtonPress = async () => {};

export default function SignIn({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  function handleSignUp() {
    if (!email || !password) {
      setErrmsg('Please fill all the details');
      showDialog();
      return;
    }
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        navigation.navigate('HOME');
      })
      .catch(error => {
        Alert.alert(error.nativeErrorMessage);
        setErrmsg(error.nativeErrorMessage);
        showDialog();
      });
  }

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <Image source={require('../assets/login.png')} style={styles.image} />
        <TextInput
          label="Email"
          mode="outlined"
          placeholder="Enter Email"
          onChangeText={setEmail}
          value={email}
          style={styles.input}
        />
        <TextInput
          label="Password"
          onChangeText={setPassword}
          placeholder="Enter password"
          mode="outlined"
          value={password}
          secureTextEntry
          style={styles.input}
        />
        <Button onPress={handleSignUp} mode="elevated" style={styles.input}>
          LOGIN
        </Button>
        <Button onPress={() => navigation.navigate('AddInfo')} mode="text">
          HOme
        </Button>
        <Button onPress={onGoogleButtonPress}>Google</Button>
      </SafeAreaView>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Error</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{errmsg}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </PaperProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '50%',
    resizeMode: 'cover',
    marginBottom: '10%',
  },
  input: {
    marginBottom: 10,
    width: '90%',
  },
  buttonsContainer: {
    justifyContent: 'center',
  },
  button: {
    width: '80%',
    padding: 20,
    marginTop: '5%',
    fontSize: 20,
  },
});
