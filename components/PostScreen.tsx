/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  TextInput,
  Avatar,
  IconButton,
  Button,
  ActivityIndicator,
} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {SafeAreaView} from 'react-native';

const PostScreen = props => {
  const [postText, setPostText] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  const handlePostSubmit = async () => {
    if (!postText || postText.trim() === '') {
      return;
    }

    setUploading(true);

    try {
      const user = auth().currentUser;
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
        imageUrl,
      });
      props.jumpTo('Home');
      setPostText('');
      setImage(null);
      setUploading(false);
    } catch (e) {
      console.error('Error adding post:', e);
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {image && (
        <Avatar.Image size={100} style={styles.imagePreview} source={image} />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  imagePreview: {
    alignSelf: 'center',
    marginBottom: 20,
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
  },
});

export default PostScreen;
