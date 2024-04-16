/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {Alert, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {
  Appbar,
  Button,
  Card,
  Divider,
  Image,
  Text,
  ActivityIndicator,
  IconButton,
} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = () => {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth().currentUser;
  console.log(user);

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

  const renderPost = post => {
    const hasImage = !!post.imageUrl;
    const contentPadding = hasImage ? 16 : 24; // Adjust padding based on image presence

    return (
      <Card key={post.id} style={styles.card}>
        <Text variant="titleLarge" style={styles.username}>
          {userData?.UserName}
        </Text>
        {hasImage && (
          <Card.Cover source={{uri: post.imageUrl}} style={styles.img} />
        )}
        <Card.Content style={{padding: contentPadding}}>
          <Text variant="bodyLarge">{post.content}</Text>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <IconButton
            icon="cards-heart-outline"
            size={24}
            mode="contained-tonal"
          />
          <IconButton
            icon="comment-flash-outline"
            size={24}
            mode="contained-tonal"
          />
          <IconButton
            icon="share-variant-outline"
            size={24}
            mode="contained-tonal"
          />
        </Card.Actions>
      </Card>
    );
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title="POSTS" />
      </Appbar.Header>
      {loading ? (
        <SafeAreaView style={styles.container}>
          <ActivityIndicator animating={true} size={'large'} />
        </SafeAreaView>
      ) : (
        <ScrollView>
          {posts.length > 0 ? (
            posts.map(renderPost)
          ) : (
            <Text>No posts found.</Text>
          )}
        </ScrollView>
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
  card: {
    marginBottom: 16,
    borderRadius: 10,
    flex: 1,
  },
  username: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cardContent: {
    paddingHorizontal: 16,
  },
  cardActions: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  img: {
    height: 500,
  },
});
