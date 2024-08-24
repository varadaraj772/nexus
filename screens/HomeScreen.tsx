import React, {useEffect, useState, useRef, useCallback, useMemo} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  RefreshControl,
  View,
  Alert,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  TextInput,
  Badge,
  Divider,
} from 'react-native-paper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RBSheet from 'react-native-raw-bottom-sheet';
import moment from 'moment';

const HomeScreen = ({navigation}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [username, setUsername] = useState('');
  const user = auth().currentUser;
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const refRBSheet = useRef();
  const [postId, setPostId] = useState(null);

  const handleError = error => {
    console.error('Error fetching user data or posts:', error);
    Alert.alert('Error', 'An error occurred. Please try again later.');
  };

  const fetchPosts = async () => {
    try {
      setRefreshing(true);
      const userSnapshot = await firestore()
        .collection('users')
        .doc(user.uid)
        .get();
      setUsername(userSnapshot.data().UserName);

      const postsRef = firestore().collection('posts');
      const querySnapshot = await postsRef.get();
      const fetchedPosts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        likedBy: doc.data().likedBy || [],
        likeCount: doc.data().likeCount || 0,
      }));

      setPosts(fetchedPosts);

      const commentsPromises = fetchedPosts.map(async post => {
        const commentsSnapshot = await firestore()
          .collection('posts')
          .doc(post.id)
          .collection('comments')
          .get();
        return {
          id: post.id,
          comments: commentsSnapshot.docs.map(doc => doc.data()),
        };
      });

      const commentsResults = await Promise.all(commentsPromises);
      const commentsData = commentsResults.reduce((acc, {id, comments}) => {
        acc[id] = comments;
        return acc;
      }, {});

      setComments(commentsData);
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

  const handleLikePress = useCallback(
    async postId => {
      try {
        const postLikes = likes[postId]?.likedBy || [];
        const liked = postLikes.includes(username);
        const updatedLikedBy = liked
          ? postLikes.filter(id => id !== username)
          : [...postLikes, username];
        const updatedLikeCount = liked
          ? (likes[postId]?.likeCount || 0) - 1
          : (likes[postId]?.likeCount || 0) + 1;

        await firestore().collection('posts').doc(postId).update({
          likedBy: updatedLikedBy,
          likeCount: updatedLikeCount,
        });

        setLikes(prevLikes => ({
          ...prevLikes,
          [postId]: {
            ...prevLikes[postId],
            likedBy: updatedLikedBy,
            likeCount: updatedLikeCount,
          },
        }));
      } catch (error) {
        handleError(error);
      }
    },
    [likes, username],
  );

  const handleCommentPress = useCallback(postId => {
    setPostId(postId);
    setNewComment('');
    refRBSheet.current.open();
  }, []);

  const handleAddComment = async () => {
    if (newComment.trim() === '' || !postId) return;

    const commentData = {
      text: newComment,
      createdAt: firestore.FieldValue.serverTimestamp(),
      author: username,
    };

    try {
      await firestore()
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .add(commentData);

      setComments(prevComments => ({
        ...prevComments,
        [postId]: [...(prevComments[postId] || []), commentData],
      }));

      setNewComment('');
      refRBSheet.current.close();
    } catch (error) {
      handleError(error);
    }
  };

  const likedPosts = useMemo(() => {
    return posts.reduce((acc, post) => {
      acc[post.id] = post.likedBy.includes(username);
      return acc;
    }, {});
  }, [posts, username]);

  const renderPost = useCallback(
    post => {
      const hasImage = !!post.imageUrl;
      const postLikes = likes[post.id] || {};
      const liked = postLikes.likedBy?.includes(username) || false;
      const likedCount = postLikes.likeCount || 0;

      return (
        <Card style={styles.card} mode="elevated" key={post.id}>
          <View style={styles.cardHeader}>
            <Text variant="titleLarge" style={styles.username}>
              {post.userName}
            </Text>
            <Text
              variant="labelMedium"
              style={[styles.timestamp, styles.alignRight]}>
              {moment(post.createdAt.toDate()).format(
                'MMMM Do YYYY, h:mm:ss a',
              )}
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
                  ? 'by ' + postLikes.likedBy[0]
                  : 'by ' +
                    postLikes.likedBy[postLikes.likedBy.length - 1] +
                    ' and ' +
                    likedCount +
                    ' others'}
              </Text>
            </Button>
            <View>
              <Badge style={styles.badge} size={39}>
                556
              </Badge>
              <Button
                mode="outlined"
                onPress={() => handleCommentPress(post.id)}
                style={{paddingLeft: 17}}>
                Comments
              </Button>
            </View>
          </Card.Actions>
        </Card>
      );
    },
    [likes, handleLikePress, handleCommentPress],
  );

  const renderComments = useMemo(
    () =>
      comments[postId]?.map((comment, index) => (
        <View key={index} style={styles.commentContainer}>
          <Text variant="labelMedium" style={styles.commentAuthor}>
            {comment.author}
          </Text>
          <Text variant="bodyMedium">{comment.text}</Text>
          <Divider />
        </View>
      )),
    [comments, postId],
  );

  return (
    <>
      {loading ? (
        <SafeAreaView style={styles.container}>
          <SkeletonPlaceholder>
            <View style={styles.skeletonContainer}>
              <View style={styles.skeletonCard} />
              <View style={styles.skeletonCard} />
              <View style={styles.skeletonCard} />
            </View>
          </SkeletonPlaceholder>
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
      <RBSheet
        ref={refRBSheet}
        height={300}
        openDuration={250}
        customStyles={{
          container: {
            padding: 10,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          },
        }}>
        <ScrollView>{renderComments}</ScrollView>
        <TextInput
          label="Add a comment"
          value={newComment}
          onChangeText={setNewComment}
          mode="outlined"
          style={styles.commentInput}
        />
        <Button
          mode="contained"
          onPress={handleAddComment}
          disabled={newComment.trim() === ''}>
          Post
        </Button>
      </RBSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  skeletonCard: {
    width: '90%',
    height: 150,
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
  },
  card: {
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: 'white',
    padding: 5,
    margin: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#F0E7FF',
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
  },
  username: {
    fontWeight: 'bold',
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
    marginVertical: 10,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    backgroundColor: '#F0E7FF',
    borderRadius: 15,
    marginVertical: 5,
  },
  text: {
    marginLeft: 25,
  },
  commentContainer: {
    flexDirection: 'column',
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  commentAuthor: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  commentInput: {
    marginVertical: 10,
  },
  badge: {
    position: 'absolute',
    top: 1,
    left: 0,
    fontWeight: '400',
    backgroundColor: '#e0ccff',
    color: 'black',
    fontSize: 15,
  },
});

export default HomeScreen;
