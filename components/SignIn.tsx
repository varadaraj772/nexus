/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';

function handleSignUp() {}

export default function SignIn({navigation}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
        />
      </View>
      <Pressable onPress={handleSignUp} style={styles.btn}>
        <Text style={styles.txt}>LOGIN</Text>
      </Pressable>
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

    justifyContent: 'center',
  },
  txt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D0707',
  },
});
