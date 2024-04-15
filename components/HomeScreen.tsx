/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {Appbar, Avatar, Button, Card, Divider, Text} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = ({navigation}) => {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth().currentUser;
  const handleError = error => {
    console.error('Error fetching user data or posts:', error);
    Alert.alert('Error', 'An error occurred. Please try again later.');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const docRef = firestore().collection('users').doc(user.uid);
          const docSnapshot = await docRef.get();
          if (docSnapshot.exists) {
            setUserData(docSnapshot.data());
          } else {
            console.log('No user data found');
          }
        } catch (error) {
          handleError(error);
        }
      }
    };

    const fetchPosts = async () => {
      try {
        const postsRef = firestore().collection('posts');
        const querySnapshot = await postsRef.get();
        const fetchedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(fetchedPosts);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator animating={true} size={'large'} />
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No user data found.</Text>
      </SafeAreaView>
    );
  }

  const renderPost = post => (
    <Card key={post.id}>
      <Card.Content>
        <Text variant="titleLarge">{userData.UserName}</Text>
      </Card.Content>
      <Card.Content>
        <Text variant="bodyLarge">{post.content}</Text>
      </Card.Content>
      <Card.Actions>
        <Button icon="fire" mode="contained-tonal">
          Yaass!
        </Button>
        <Button icon="comment-quote" mode="contained-tonal">
          Gush
        </Button>
        <Button icon="share-variant-outline" mode="contained-tonal">
          Share
        </Button>
      </Card.Actions>
      <Divider />
    </Card>
  );

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title="POSTS" />
      </Appbar.Header>
      {posts.length > 0 ? (
        <ScrollView>{posts.map(renderPost)}</ScrollView>
      ) : (
        <Text>No posts found.</Text>
      )}
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfo: {
    marginBottom: 20,
  },
});
