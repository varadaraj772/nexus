import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, SafeAreaView, ScrollView} from 'react-native';
import {
  TextInput,
  IconButton,
  Button,
  ActivityIndicator,
  Dialog,
  Portal,
  Text,
  PaperProvider,
} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import WebView from 'react-native-webview';

const PostScreen = ({navigation}) => {
  const user = auth().currentUser;
  const [postText, setPostText] = useState('');
  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errmsg, setErrmsg] = useState('');
  const [visible, setVisible] = useState(false);
  const [caption, setCaption] = useState('');
  const [loadingCaption, setLoadingCaption] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showWebView, setShowWebView] = useState(false);

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
        // Generate caption when image is picked
        // You might choose to set up the WebView for caption generation here or just wait for the button click
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
      setErrmsg('PLEASE SELECT AN IMAGE OR ENTER TEXT TO POST');
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
        content: postText || caption,
        authorId: user.uid,
        createdAt: timestamp,
        userName: userData.UserName,
        imageUrl,
      });
      navigation.navigate('Home');
      setPostText('');
      setImage(null);
      setCaption('');
      setUploading(false);
    } catch (e) {
      console.error('Error adding post:', e);
      setUploading(false);
    }
  };

  const handleWebViewNavigationStateChange = event => {
    if (event.url.includes('caption_copied')) {
      const params = new URLSearchParams(new URL(event.url).search);
      const captionFromWebView = params.get('caption');
      if (captionFromWebView) {
        setCaption(captionFromWebView);
        setShowWebView(false); // Close WebView
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        {showWebView ? (
          <WebView
            source={{
              uri: 'https://captioncraftai-varadaraj-s-projects.vercel.app/',
            }}
            onNavigationStateChange={handleWebViewNavigationStateChange}
          />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.imageContainer}>
              {image ? (
                <Image source={image} style={styles.image} />
              ) : (
                <Image
                  source={require('../assets/addPost.png')}
                  style={styles.image}
                />
              )}
            </View>
            <TextInput
              label="Write your post..."
              value={postText}
              onChangeText={setPostText}
              multiline
              numberOfLines={4}
              style={styles.textInput}
            />
            <View style={styles.buttonRow}>
              <Button
                icon="image"
                onPress={pickImage}
                mode="contained-tonal"
                style={styles.longButton}>
                Select Image
              </Button>
              <Button
                mode="contained-tonal"
                style={styles.longButton}
                onPress={() => setShowWebView(true)}
                disabled={!image}>
                GENERATE CAPTION
              </Button>
              <Button
                mode="contained-tonal"
                style={styles.longButton}
                onPress={handlePostSubmit}
                loading={uploading}>
                ADD POST
              </Button>
            </View>
            {loadingCaption && (
              <ActivityIndicator
                size="large"
                animating={true}
                style={styles.activityIndicator}
              />
            )}
            {caption && (
              <View style={styles.captionContainer}>
                <Text style={styles.captionText}>{caption}</Text>
                <Button
                  mode="contained"
                  onPress={() => {
                    // Assuming you want to open the URL in the browser
                    Linking.openURL(
                      `https://captioncraftai-varadaraj-s-projects.vercel.app/?caption=${encodeURIComponent(
                        caption,
                      )}`,
                    );
                    setCopied(true);
                  }}
                  style={styles.copyButton}>
                  {copied ? 'COPIED' : 'COPY CAPTION'}
                </Button>
              </View>
            )}
            <Portal>
              <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>NOTICE</Dialog.Title>
                <Dialog.Content>
                  <Text>{errmsg}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={hideDialog}>Close</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </ScrollView>
        )}
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContainer: {
    padding: 20,
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: 20,
  },
  longButton: {
    width: '100%',
    marginBottom: 10,
  },
  captionContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  captionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  copyButton: {
    marginTop: 10,
  },
  activityIndicator: {
    marginTop: 20,
  },
});

export default PostScreen;
