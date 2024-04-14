/* eslint-disable prettier/prettier */
import {View, Text, Button} from 'react-native';
import React, {useState} from 'react';
import {TextInput} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const PostScreen = () => {
  const [postText, setPostText] = useState(''); // State for post content
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

      await postRef.set({
        content: postText,
        authorId: user.uid,
        createdAt: timestamp,
      });
      setPostText('');
    } catch (e) {
      console.error('Error adding post:', e);
    }
  };
  return (
    <View style={{padding: 20}}>
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
