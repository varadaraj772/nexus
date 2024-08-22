/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Divider,
  Card,
  Title,
  Paragraph,
} from 'react-native-paper';
import moment from 'moment';

const ProfileScreen = ({navigation}) => {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = auth().currentUser;

  const handleError = error => {
    console.error('Error fetching user data:', error);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const docRef = firestore().collection('users').doc(user.uid);
          const docSnapshot = await docRef.get();
          if (docSnapshot.exists) {
            setUserData(docSnapshot.data());
          } else {
            console.log('No user data found');
          }
        } catch (error) {
          handleError(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const fetchUserPosts = async () => {
      if (user) {
        try {
          const postsRef = firestore()
            .collection('posts')
            .where('authorId', '==', user.uid);
          const snapshot = await postsRef.get();
          const postsList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPosts(postsList);
        } catch (error) {
          handleError(error);
        }
      }
    };

    fetchUserData();
    fetchUserPosts();
  }, [user]);

  if (isLoading || !userData) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator animating={true} size={'large'} />
      </SafeAreaView>
    );
  }

  const SignOut = () => {
    auth().signOut();
    navigation.popToTop();
  };

  const imgData = userData?.imageurl && {uri: userData.imageurl};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profileImageContainer}>
          <Avatar.Image size={200} source={imgData} />
        </View>
        <View style={styles.userDetailsContainer}>
          <Text style={styles.userName}>FULLNAME : {userData.FullName}</Text>
          <Text style={styles.userEmail}>EMAIL : {userData.Email}</Text>
          <Text style={styles.userUsername}>
            USERNAME : {userData.UserName}
          </Text>
          <Button
            mode="contained"
            onPress={SignOut}
            style={styles.signOutButton}>
            SIGN OUT
          </Button>
          <Divider style={styles.divider} />
        </View>
        <View style={styles.postsContainer}>
          <Text style={styles.postsHeader}>POSTS</Text>

          {posts.length > 0 ? (
            posts.map(post => (
              <Card key={post.id} style={styles.postCard}>
                <Card.Content>
                  <Title style={styles.postTitle}>{post.content}</Title>

                  <Paragraph style={styles.postDate}>
                    {moment(post.createdAt.toDate()).format(
                      'MMMM Do YYYY, h:mm:ss a',
                    )}
                  </Paragraph>
                </Card.Content>
                {post.imageUrl && (
                  <Card.Cover
                    source={{uri: post.imageUrl}}
                    style={styles.postImage}
                    resizeMode="cover"
                  />
                )}
              </Card>
            ))
          ) : (
            <Text style={styles.noPostsText}>No posts available.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  userDetailsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 18,
    color: 'gray',
  },
  userUsername: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 10,
  },
  divider: {
    width: '80%',
    marginVertical: 5,
  },
  postsContainer: {
    marginBottom: 20,
  },
  postsHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  postCard: {
    marginBottom: 20,
    elevation: 2,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postAuthor: {
    fontSize: 14,
    color: 'gray',
  },
  postDate: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
  },
  postImage: {
    marginTop: 10,
    height: 500,
  },
  noPostsText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  signOutButton: {
    marginVertical: 5,
  },
});

export default ProfileScreen;
