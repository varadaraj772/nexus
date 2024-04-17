/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {StyleSheet, SafeAreaView, Alert, View} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {Avatar, Button, IconButton} from 'react-native-paper';
import auth from '@react-native-firebase/auth';

const AddProfile = ({navigation}) => {
  const [image, setImage] = useState(null);

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
    }
    await postRef.update({
      imageurl: imageUrl,
    });
    Alert.alert('Profile photo added');
    navigation.navigate('HOME');
  };

  return (
    <SafeAreaView>
      <View>
        {image && <Avatar.Image size={100} source={image} />}
        <IconButton icon="image" onPress={pickImage} mode="contained-tonal" />
        <Button mode="contained-tonal" onPress={handleProfileSubmit}>
          ADD PROFILE
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default AddProfile;
