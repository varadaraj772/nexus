/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {Avatar, Button, Text, TextInput} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';

const theme = {
  colors: {
    primary: '#F08080', // Light coral (Create Account button)
    secondary: '#3F51B5', // Indigo (text and icons)
    background: '#F5F5F5', // Light gray (background)
  },
};

export default function SignUp({navigation}) {
  const Signup = (email: string, password: string) => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        navigation.navigate('LOGIN');
      })
      .catch(error => {
        Alert.alert(error.nativeErrorMessage);
      });
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSignup = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    Signup(email, password);
  };
  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        label="Email"
        mode="outlined"
        onChangeText={setEmail}
        value={email}
        style={styles.input}
      />
      <TextInput
        label="Password"
        onChangeText={setPassword}
        placeholder="enter emil"
        mode="outlined"
        value={password}
        secureTextEntry
        style={styles.input}
      />
      <Button onPress={handleSignup} mode="elevated" style={styles.input}>
        CREATE ACCOUNT
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('LOGIN')}
        style={styles.input}>
        go to login
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
