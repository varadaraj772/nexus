/* eslint-disable prettier/prettier */
import {StyleSheet, SafeAreaView, StatusBar, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';

import {
  PaperProvider,
  TextInput,
  Button,
  Dialog,
  Portal,
  Text,
  HelperText,
} from 'react-native-paper';
import {Image} from 'react-native';

export default function SignIn({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [visible, setVisible] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  function handleSignIn() {
    if (!email || !password) {
      setErrmsg('Please fill all the details');
      showDialog();
      return;
    }
    console.log(auth);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        navigation.navigate('Home');
      })
      .catch(error => {
        setErrmsg(error.message);
        showDialog();
      });
  }
  const iconName = showPassword ? 'eye' : 'eye-off';
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
          secureTextEntry={!showPassword}
          style={styles.input}
          right={
            <TextInput.Icon
              icon={iconName}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />
        <Button onPress={handleSignIn} mode="elevated" style={styles.input}>
          SignIn
        </Button>
        <HelperText
          type="error"
          onPress={() => {
            if (email) {
              auth()
                .sendPasswordResetEmail(email)
                .then(() => {
                  setErrmsg('Password reset link has been sent to your mail');
                })
                .then(() => showDialog());
            } else {
              setErrmsg('Please enter email to send password reset link');
              return showDialog();
            }
          }}>
          RESET PASSWORD
        </HelperText>
      </SafeAreaView>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>NOTICE</Dialog.Title>
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
