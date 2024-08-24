/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  Button,
  Text,
  TextInput,
  Dialog,
  Portal,
  PaperProvider,
  Avatar,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {SafeAreaView, StyleSheet, View, StatusBar} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUp({navigation}) {
  useEffect(() => {
    StatusBar.setBackgroundColor('gray');
    getPlaceholderImageUrl();
  }, []);

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [placeholderImageUrl, setPlaceholderImageUrl] = useState(null); // State to hold placeholder image URL

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const getPlaceholderImageUrl = async () => {
    try {
      const storageRef = storage().ref('profile_photos/avatar_placeholder.png');
      const url = await storageRef.getDownloadURL();
      setPlaceholderImageUrl(url);
    } catch (error) {
      console.error('Error getting placeholder image URL:', error);
    }
  };

  const pickAndCropImage = async () => {
    try {
      const result = await launchImageLibrary({mediaType: 'photo'});
      if (!result.didCancel && !result.error) {
        const croppedImage = await ImageCropPicker.openCropper({
          path: result.assets[0].uri,
          width: 300,
          height: 300,
          cropping: true,
          cropperCircleOverlay: true,
        });
        setCroppedImage({uri: croppedImage.path});
      }
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const usernameExists = await checkUsernameExists(username);
      if (usernameExists) {
        setErrmsg(
          'Username already exists! Please choose a different username',
        );
        showDialog();
        setIsLoading(false);
        return;
      }

      const userCred = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const uid = userCred.user.uid;

      let imageUrl = placeholderImageUrl; // Use placeholder image URL by default
      if (croppedImage) {
        const filename = croppedImage.uri.split('/').pop();
        const storageRef = storage().ref(`profile_photos/${filename}`);
        await storageRef.putFile(croppedImage.uri);
        imageUrl = await storageRef.getDownloadURL();
      }

      await firestore().collection('users').doc(uid).set({
        UserName: username,
        password: password,
        FullName: fullName.toUpperCase(),
        Email: email,
        imageurl: imageUrl,
      });

      setErrmsg('User Created Successfully!');
      showDialog();
      navigation.navigate('Home'); // Navigate to the Home screen after successful signup
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
        <Avatar.Image
          size={100}
          source={
            croppedImage ? {uri: croppedImage.uri} : {uri: placeholderImageUrl}
          }
          style={styles.avatar}
        />
        <Button onPress={pickAndCropImage}>Choose Profile Picture</Button>

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
            {isLoading ? 'Loading...' : 'Sign Up'}
          </Button>
        </View>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>
              {errmsg === 'User Created Successfully!' ? 'Success' : 'Error'}
            </Dialog.Title>
            <Dialog.Content>
              <Text>{errmsg}</Text>
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
  avatar: {
    marginBottom: 10,
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
