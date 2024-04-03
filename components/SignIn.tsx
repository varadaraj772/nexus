/* eslint-disable prettier/prettier */
import {
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Pressable,
  Button,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export default function SignIn({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  function handleSignUp() {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        navigation.navigate('HOME');
      })
      .catch((error: {nativeErrorMessage: string}) => {
        Alert.alert(error.nativeErrorMessage);
      });
  }
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '193011697623-97rbr611a14fius03v97u8tvajjneigf.apps.googleusercontent.com',
    });
  }, []);
  async function onGoogleButtonPress() {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.log(error);
      console.log(error);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
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
      <Pressable onPress={handleSignUp} style={styles.btn}>
        <Text style={styles.txt}>LOGIN</Text>
      </Pressable>
      <Button title="go to home" onPress={() => navigation.navigate('HOME')} />
      <Button
        title="Google Sign-In"
        onPress={() =>
          onGoogleButtonPress().then(() => navigation.navigate('HOME'))
        }
      />
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
