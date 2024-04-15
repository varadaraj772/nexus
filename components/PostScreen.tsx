/* eslint-disable prettier/prettier */
import {View, Text, Button, Image} from 'react-native';
import React, {useState} from 'react';
import {TextInput} from 'react-native-paper';
import {
  ImageLibraryOptions,
  launchImageLibrary,
  MediaType,
} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage'; // Import for storage
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const PostScreen = () => {
  const [postText, setPostText] = useState(''); // State for post content
  const [image, setImage] = useState(null); // State for image

  // Function to pick an image from the device
  const pickImage = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo', // Or MediaType.VIDEO for videos
      quality: 1,
    };

    try {
      const result = await launchImageLibrary(options);
      if (result.didCancel) {
        console.log('User cancelled image picker');
      } else if (result.error) {
        console.error('ImagePicker Error:', result.error);
      } else {
        console.log(result.assets[0].uri);
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
      setPostText('');
      setImage(null); 
    } catch (e) {
      console.error('Error adding post:', e);
    }
  };

  return (
    <View style={{padding: 20}}>
      {/* Conditionally render image based on image state */}
      {image && <Image source={image} style={{width: 200, height: 200}} />}
      <Button title="Pick Image" onPress={pickImage} />
      <TextInput
        label="Write your post..."
        value={postText}
        onChangeText={setPostText}
        multiline
        numberOfLines={4}
      />
      <Button title="Submit Post" onPress={handlePostSubmit} />
    </View>
  );
};

export default PostScreen;
