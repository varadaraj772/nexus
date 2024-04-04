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
  'colors': {
    'primary': 'rgb(120, 69, 172)',
    'onPrimary': 'rgb(255, 255, 255)',
    'primaryContainer': 'rgb(240, 219, 255)',
    'onPrimaryContainer': 'rgb(44, 0, 81)',
    'secondary': 'rgb(102, 90, 111)',
    'onSecondary': 'rgb(255, 255, 255)',
    'secondaryContainer': 'rgb(237, 221, 246)',
    'onSecondaryContainer': 'rgb(33, 24, 42)',
    'tertiary': 'rgb(128, 81, 88)',
    'onTertiary': 'rgb(255, 255, 255)',
    'tertiaryContainer': 'rgb(255, 217, 221)',
    'onTertiaryContainer': 'rgb(50, 16, 23)',
    'error': 'rgb(186, 26, 26)',
    'onError': 'rgb(255, 255, 255)',
    'errorContainer': 'rgb(255, 218, 214)',
    'onErrorContainer': 'rgb(65, 0, 2)',
    'background': 'rgb(255, 251, 255)',
    'onBackground': 'rgb(29, 27, 30)',
    'surface': 'rgb(255, 251, 255)',
    'onSurface': 'rgb(29, 27, 30)',
    'surfaceVariant': 'rgb(233, 223, 235)',
    'onSurfaceVariant': 'rgb(74, 69, 78)',
    'outline': 'rgb(124, 117, 126)',
    'outlineVariant': 'rgb(204, 196, 206)',
    'shadow': 'rgb(0, 0, 0)',
    'scrim': 'rgb(0, 0, 0)',
    'inverseSurface': 'rgb(50, 47, 51)',
    'inverseOnSurface': 'rgb(245, 239, 244)',
    'inversePrimary': 'rgb(220, 184, 255)',
    'elevation': {
      'level0': 'transparent',
      'level1': 'rgb(248, 242, 251)',
      'level2': 'rgb(244, 236, 248)',
      'level3': 'rgb(240, 231, 246)',
      'level4': 'rgb(239, 229, 245)',
      'level5': 'rgb(236, 226, 243)'
    },
    'surfaceDisabled': 'rgba(29, 27, 30, 0.12)',
    'onSurfaceDisabled': 'rgba(29, 27, 30, 0.38)',
    'backdrop': 'rgba(51, 47, 55, 0.4)'
  }
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
          mode="elevated"
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
