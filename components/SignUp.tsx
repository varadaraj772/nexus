/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  Button,
  Text,
  TextInput,
  Dialog,
  Portal,
  PaperProvider,
} from 'react-native-paper';

import auth from '@react-native-firebase/auth';
import {Image, SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';

export default function SignUp({navigation}) {
  useEffect(() => {
    StatusBar.setBackgroundColor('gray');
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const Signup = (email: string, password: string) => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        navigation.navigate('LOGIN');
      })
      .catch(error => {
        setErrmsg(error.nativeErrorMessage);
        showDialog();
      });
  };

  const handleSignup = () => {
    if (!email || !password) {
      setErrmsg('Please fill all the details');
      showDialog();
      return;
    }
    Signup(email, password);
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <Image source={require('../assets/signup.png')} style={styles.image} />
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
        <View style={styles.buttonsContainer}>
          <Button mode="elevated" style={styles.button} onPress={handleSignup}>
            CREATE ACCOUNT
          </Button>
          <Button
            mode="contained-tonal"
            style={styles.button}
            onPress={() => navigation.navigate('LOGIN')}>
            GO TO LOGIN
          </Button>
        </View>
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
      </SafeAreaView>
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
    height: 400,
    resizeMode: 'cover',
    marginBottom: '20%',
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
    padding: 10,
    marginTop: '5%',
    fontSize: 20,
  },
});
