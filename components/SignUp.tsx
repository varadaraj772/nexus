/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  Button,
  Text,
  TextInput,
  Dialog,
  Portal,
  PaperProvider,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {Image, SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export default function SignUp({navigation}) {
  useEffect(() => {
    StatusBar.setBackgroundColor('gray');
  }, []);

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const usernameExists = await checkUsernameExists(username);
      if (usernameExists) {
        setErrmsg('Username already exists!');
        showDialog();
        setIsLoading(false);
        return;
      }

      const userCred = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const uid = userCred.user.uid;
      await firestore().collection('users').doc(uid).set({
        UserName: username,
        password: password,
        FullName: fullName.toUpperCase(),
        Email: email,
      });
      setErrmsg('User Created Successfully!');
      showDialog();
      navigation.navigate('ADDPROFILE');
    } catch (error) {
      setErrmsg(error.message);
      showDialog();
    } finally {
      setIsLoading(false);
    }
  };

  const checkUsernameExists = async username => {
    try {
      const snapshot = await firestore()
        .collection('users')
        .where('UserName', '==', username)
        .get();
      return !snapshot.empty;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };

  const validateForm = () => {
    if (!email || !password || !fullName || !username) {
      setErrmsg('Please fill all the details');
      showDialog();
      return false;
    }

    if (!EMAIL_REGEX.test(email)) {
      setErrmsg('Invalid email address');
      showDialog();
      return false;
    }
    return true;
  };
  const iconName = showPassword ? 'eye' : 'eye-off';
  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        {email || password || username || fullName ? (
          ''
        ) : (
          <Image
            source={require('../assets/signup.png')}
            style={styles.image}
          />
        )}

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
        <TextInput
          label="Username"
          onChangeText={setUsername}
          placeholder="Add Username"
          mode="outlined"
          value={username}
          style={styles.input}
        />
        <TextInput
          label="FullName"
          onChangeText={setFullName}
          placeholder="Enter your FullName"
          mode="outlined"
          value={fullName}
          style={styles.input}
        />
        <View style={styles.buttonsContainer}>
          <Button
            mode="elevated"
            style={styles.button}
            onPress={handleSignup}
            disabled={isLoading}>
            {isLoading ? 'Loading...' : 'CREATE ACCOUNT'}
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
    height: '50%',
    resizeMode: 'cover',
    marginBottom: '5%',
  },
  input: {
    marginBottom: 5,
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
