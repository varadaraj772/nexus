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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex

export default function SignUp({navigation}) {
  useEffect(() => {
    StatusBar.setBackgroundColor('gray');
  }, []);

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [visible, setVisible] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleSignup = async () => {
    if (!validateForm()) {
      return; // Prevent signup if validation fails
    }

    setIsLoading(true); // Set loading state

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
        FullName: fullName,
        Email: email,
        MobileNo: mobileNo,
      });
      setErrmsg('User Created Successfully!');
      showDialog();
      navigation.navigate('HOME'); // Navigate to home after success
    } catch (error) {
      handleSignupError(error); // Handle signup errors
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleSignupError = error => {
    const errorCodes = {
      'auth/email-already-in-use': 'Email already in use',
      'auth/weak-password': 'Password is too weak',
      // Add more error codes as needed
    };
    setErrmsg(errorCodes[error.code] || 'Signup failed. Please try again.');
    showDialog();
  };

  const checkUsernameExists = async username => {
    try {
      const snapshot = await firestore()
        .collection('users')
        .where('UserName', '==', username)
        .get();
      return !snapshot.empty; // True if username exists, False otherwise
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };

  const validateForm = () => {
    if (!email || !password || !fullName || !username || !mobileNo) {
      setErrmsg('Please fill all the details');
      showDialog();
      return false;
    }

    if (!EMAIL_REGEX.test(email)) {
      setErrmsg('Invalid email address');
      showDialog();
      return false;
    }

    // You can add more validation checks here (e.g., password strength)
    return true;
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
        <TextInput
          label="MobileNumber"
          onChangeText={setMobileNo}
          placeholder="Enter your MobileNumber"
          mode="outlined"
          value={mobileNo}
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
    height: 400,
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
