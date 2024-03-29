/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  Alert,
  Button,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import auth from '@react-native-firebase/auth';
export default function SignUp({navigation}) {
  const Signup = (email: string, password: string) => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert('User created');
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
  const [username, setUsername] = useState('');
  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        style={styles.input}
        placeholderTextColor="#0D0707"
      />
      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#0D0707"
      />
      <Pressable onPress={handleSignup} style={styles.btn}>
        <Text style={styles.txt}>CREATE ACCOUNT</Text>
      </Pressable>
      <Button title="go to next page" onPress={navigation.navigate('LOGIN')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#255957',
  },
  input: {
    width: '100%',
    height: 50,
    padding: 15,
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: '#E2F3F2',
    fontSize: 16,
    borderBottomColor: '#ccc',
  },
  btn: {
    width: '100%',
    height: 50,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#FE7F48',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
  },
  txt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D0707',
  },
});
