/* eslint-disable prettier/prettier */
import {StyleSheet, SafeAreaView} from 'react-native';
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
const theme = {
  colors: {
    primary: '#F08080',
    secondary: '#3F51B5',
    background: '#F5F5F5',
  },
};

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
      .catch((error: {nativeErrorMessage: string}) => {
        setErrmsg(error.nativeErrorMessage);
      });
  }
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '193011697623-97rbr611a14fius03v97u8tvajjneigf.apps.googleusercontent.com',
    });
  }, []);

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
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
        <Button
          onPress={handleSignUp}
          mode="contained-tonal"
          style={styles.input}>
          LOGIN
        </Button>
        <Button onPress={() => navigation.navigate('HOME')} mode="text">
          HOME
        </Button>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    alignItems: 'center',
  },
  input: {
    marginTop: 10,
    width: '80%',
  },
  button: {
    marginTop: 20,
  },
});
