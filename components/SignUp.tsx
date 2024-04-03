/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  Button,
  Text,
  TextInput,
  Dialog,
  Portal,
  PaperProvider,
} from 'react-native-paper';

import auth from '@react-native-firebase/auth';
import {SafeAreaView, StyleSheet} from 'react-native';

const theme = {
  colors: {
    primary: '#F08080',
    secondary: '#3F51B5',
    background: '#F5F5F5',
  },
};

export default function SignUp({navigation}) {
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
          onPress={handleSignup}
          mode="contained-tonal"
          style={styles.input}>
          CREATE ACCOUNT
        </Button>
        <Button
          mode="contained-tonal"
          onPress={() => navigation.navigate('LOGIN')}
          style={styles.input}>
          GO TO LOGIN
        </Button>
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
