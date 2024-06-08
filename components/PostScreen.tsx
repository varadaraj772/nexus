/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import {
  TextInput,
  Avatar,
  IconButton,
  Button,
  ActivityIndicator,
  Dialog,
  Portal,
  PaperProvider,
} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {SafeAreaView} from 'react-native';

const PostScreen = ({navigation}) => {
  const user = auth().currentUser;
  const [postText, setPostText] = useState('');
  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

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
  const fetchUser = async () => {
    const docRef = firestore().collection('users').doc(user.uid);
    const docSnapshot = await docRef.get();
    if (docSnapshot.exists) {
      setUserData(docSnapshot.data());
    }
  };

  const handlePostSubmit = async () => {
    if ((!postText || postText.trim() === '') && !image) {
      setErrmsg('PLEASE SELECT A IMAGE OR ENTER A TEXT TO POST');
      showDialog();
      return;
    }
    setUploading(true);
    try {
      if (!user) {
        return;
      }
      const timestamp = firestore.FieldValue.serverTimestamp();
      const postRef = firestore().collection('posts').doc();
      let imageUrl = null;
      if (image) {
        const filename = image.uri.split('/').pop();
        const storageRef = storage().ref(`posts/${filename}`);
        await storageRef.putFile(image.uri);
        imageUrl = await storageRef.getDownloadURL();
      }

      await postRef.set({
        content: postText,
        authorId: user.uid,
        createdAt: timestamp,
        userName: userData.UserName,
        imageUrl,
      });
      navigation.navigate('Home');
      setPostText('');
      setImage(null);
      setUploading(false);
    } catch (e) {
      console.error('Error adding post:', e);
      setUploading(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        {image ? (
          <Image source={image} style={styles.image} />
        ) : (
          <Image
            source={require('../assets/addPost.png')}
            style={styles.image}
          />
        )}
        <TextInput
          label="Write your post..."
          value={postText}
          onChangeText={setPostText}
          multiline
          numberOfLines={4}
          style={styles.textInput}
        />
        <View style={styles.buttonRow}>
          <IconButton icon="image" onPress={pickImage} mode="contained-tonal" />
          <Button
            mode="contained-tonal"
            style={styles.postbtn}
            onPress={handlePostSubmit}>
            ADD POST
          </Button>
        </View>
        {uploading && (
          <ActivityIndicator
            size="large"
            animating={true}
            style={styles.activityIndicator}
          />
        )}
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>NOTICE</Dialog.Title>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  activityIndicator: {
    marginTop: 20,
  },
  postbtn: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
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

export default PostScreen;
