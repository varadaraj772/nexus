/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  RefreshControl,
  View,
} from 'react-native';
import {
  Appbar,
  Card,
  Text,
  ActivityIndicator,
  Button,
  IconButton,
} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = props => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [username, setUsername] = useState('');
  const user = auth().currentUser;
  const [likes, setLikes] = useState({});
  const handleError = (error: unknown) => {
    console.error('Error fetching user data or posts:', error);
    Alert.alert('Error', 'An error occurred. Please try again later.');
  };

  const fetchPosts = async () => {
    try {
      setRefreshing(true);
      setUsername(
        (await firestore().collection('users').doc(user.uid).get()).data()
          .UserName,
      );
      const postsRef = firestore().collection('posts');
      const querySnapshot = await postsRef.get();
      const fetchedPosts = querySnapshot.docs.map(doc => {
        const postData =
          typeof doc.data() === 'object' && doc.data() !== null
            ? doc.data()
            : {};
        return {
          id: doc.id,
          ...postData,
          likedBy: postData.likedBy || [],
          likeCount: doc.data().likeCount || 0,
        };
      });
      setPosts(fetchedPosts);
      setLikes(
        fetchedPosts.reduce((acc, post) => {
          acc[post.id] = {
            ...post,
            likedBy: post.likedBy,
            likeCount: post.likeCount,
          };
          return acc;
        }, {}),
      );
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLikePress = async (postId: React.Key | null | undefined) => {
    try {
      const liked = likes[postId].likedBy?.includes(username) || false;
      const updatedLikedBy = liked
        ? [
            ...likes[postId].likedBy.filter(
              (id: string | undefined) => id !== username,
            ),
          ]
        : [...likes[postId].likedBy, username];
      const updatedLikeCount = liked
        ? likes[postId].likeCount - 1
        : likes[postId].likeCount + 1;

      await firestore().collection('posts').doc(postId).update({
        likedBy: updatedLikedBy,
        likeCount: updatedLikeCount,
      });

      setLikes({
        ...likes,
        [postId]: {
          ...likes[postId],
          likedBy: updatedLikedBy,
          likeCount: updatedLikeCount,
        },
      });
    } catch (error) {
      handleError(error);
    }
  };
  const renderPost = (post: {
    imageUrl: any;
    createdAt: any;
    id: React.Key | null | undefined;
    userName:
      | string
      | number
      | boolean
      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
      | Iterable<React.ReactNode>
      | React.ReactPortal
      | null
      | undefined;
    content:
      | string
      | number
      | boolean
      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
      | Iterable<React.ReactNode>
      | React.ReactPortal
      | null
      | undefined;
  }) => {
    const hasImage = !!post.imageUrl;
    const timestamp = post.createdAt;
    const dateString = timestamp.toDate().toLocaleString();
    const liked = likes[post.id]?.likedBy?.includes(username) || false;
    const likedCount = likes[post.id]?.likeCount;
    console.log(post.id);
    return (
      <>
        <Card key={post.id} style={styles.card} mode="elevated">
          <View style={styles.cardHeader}>
            <Text variant="titleLarge" style={styles.username}>
              {post.userName}
            </Text>
            <Text
              variant="labelMedium"
              style={[styles.timestamp, styles.alignRight]}>
              {dateString}
            </Text>
          </View>
          {hasImage && (
            <Card.Cover source={{uri: post.imageUrl}} style={styles.img} />
          )}
          <Card.Content style={styles.content}>
            <Text variant="bodyLarge">{post.content}</Text>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <Button
              icon={liked ? 'cards-heart' : 'cards-heart-outline'}
              mode="outlined"
              onPress={() => handleLikePress(post.id)}>
              <Text style={styles.text}>
                {likedCount === 0
                  ? likedCount
                  : likedCount === 1
                  ? 'by ' + username
                  : 'by ' + username + ' and ' + likedCount + ' others'}
              </Text>
            </Button>
            <Button
              icon="comment-flash-outline"
              mode="outlined"
              onPress={() => {}}>
              3 comments
            </Button>
          </Card.Actions>
        </Card>
      </>
    );
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title="NEXUS" />
        <Appbar.Action icon="bell-badge" onPress={() => {}} />
      </Appbar.Header>
      {loading ? (
        <SafeAreaView style={styles.container}>
          <ActivityIndicator animating={true} size={'large'} />
        </SafeAreaView>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchPosts} />
          }>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: 'white',
    padding: 5,
    margin: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 7,
    backgroundColor: '#F0E7FF',
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
  },
  username: {
    fontWeight: 'bold',
    textAlign: 'left',
  },
  timestamp: {
    color: 'gray',
  },
  alignRight: {
    textAlign: 'right',
  },
  img: {
    height: 400,
    resizeMode: 'stretch',
    borderRadius: 0,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  content: {
    paddingVertical: 10,
    backgroundColor: '#F0E7FF',
    borderRadius: 15,
    marginTop: 5,
  },
  cardActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#F0E7FF',
    borderRadius: 15,
    marginVertical: 5,
  },
  text: {
    fontWeight: 'bold',
  },
});
