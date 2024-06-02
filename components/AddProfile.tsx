/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {StyleSheet, SafeAreaView, Alert, View, Image} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {
  Avatar,
  Button,
  Dialog,
  IconButton,
  PaperProvider,
  Portal,
  Text,
} from 'react-native-paper';
import auth from '@react-native-firebase/auth';

const AddProfile = ({navigation}) => {
  const [image, setImage] = useState(null);
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const [errmsg, setErrmsg] = useState('');
  const pickImage = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 1,
    };
    try {
      const result = await launchImageLibrary(options);
      if (result.didCancel) {
        console.log('User cancelled image picker');
      } else if (result.error) {
        console.error('ImagePicker Error:', result.error);
      } else {
        const source = {uri: result.assets[0].uri};
        setImage(source);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };
  const handleProfileSubmit = async () => {
    let imageUrl = null;
    const uid = auth().currentUser?.uid;
    const postRef = firestore().collection('users').doc(uid);
    if (image) {
      const filename = image.uri.split('/').pop();
      const storageRef = storage().ref(`profile_photos/${filename}`);
      await storageRef.putFile(image.uri);
      imageUrl = await storageRef.getDownloadURL();
    } else {
      setErrmsg('PlEASE SELECT A PROFILE PHOTO TO ADD');
      showDialog();
    }
    if (imageUrl) {
      await postRef.update({
        imageurl: imageUrl,
      });
      navigation.navigate('HOME');
    }
  };

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        {image ? (
          <Image source={image} style={styles.image} />
        ) : (
          <Image
            source={require('../assets/addprofile.png')}
            style={styles.image}
          />
        )}
        <IconButton icon="image" onPress={pickImage} mode="contained-tonal" />
        <Button mode="contained-tonal" onPress={handleProfileSubmit}>
          ADD PROFILE
        </Button>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Error</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">{errmsg}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Okay</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
    marginBottom: '5%',
    alignSelf: 'center',
    borderRadius: 10,
  },
});

export default AddProfile;
