import React, {useEffect, useState, useRef, useCallback, useMemo} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  RefreshControl,
  View,
  Alert,
  Image,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  TextInput,
  Badge,
  Divider,
  useTheme,
} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import RBSheet from 'react-native-raw-bottom-sheet';
import moment from 'moment';
import HomeSkeleton from '../skeletons/HomeSkeleton';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [username, setUsername] = useState('');
  const user = auth().currentUser;
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const refRBSheet = useRef();
  const [imageDimensions, setImageDimensions] = useState({});
  const [postId, setPostId] = useState(null);
  const {colors} = useTheme();

  const handleError = error => {
    console.error('Error fetching user data or posts:', error);
    Alert.alert('Error', 'An error occurred. Please try again later.');
  };

  const fetchPosts = async () => {
    try {
      setRefreshing(true);
      setLoading(true);
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
        commentCount: doc.data().commentCount || 0,
      }));

      setPosts(fetchedPosts);

      fetchedPosts.forEach(post => {
        if (post.imageUrl) {
          Image.getSize(post.imageUrl, (width, height) => {
            setImageDimensions(prev => ({
              ...prev,
              [post.id]: {width, height},
            }));
          });
        }
      });

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
    if (newComment.trim() === '' || !postId) {
      return;
    }

    const commentData = {
      text: newComment,
      createdAt: firestore.FieldValue.serverTimestamp(),
      author: username,
    };

    try {
      const postRef = firestore().collection('posts').doc(postId);

      await postRef.collection('comments').add(commentData);

      await postRef.update({
        commentCount: firestore.FieldValue.increment(1),
      });

      setComments(prevComments => ({
        ...prevComments,
        [postId]: [...(prevComments[postId] || []), commentData],
      }));

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {...post, commentCount: (post.commentCount || 0) + 1}
            : post,
        ),
      );

      setNewComment('');
      refRBSheet.current.close();
    } catch (error) {
      handleError(error);
    }
  };

  const renderPost = useCallback(
    post => {
      const hasImage = !!post.imageUrl;
      const postLikes = likes[post.id] || {};
      const liked = postLikes.likedBy?.includes(username) || false;
      const likedCount = postLikes.likeCount || 0;

      return (
        <>
          <Card
            style={[styles.card, {backgroundColor: colors.background}]}
            mode="elevated"
            key={post.id}>
            <View style={styles.cardHeader}>
              <Text variant="titleLarge" style={styles.username}>
                {post.userName}
              </Text>
              <Text
                variant="labelMedium"
                style={[styles.timestamp, styles.alignRight]}>
                {moment(post.createdAt.toDate()).format('MMMM Do YYYY, h:mm a')}
              </Text>
            </View>
            {hasImage && (
              <Card.Cover
                source={{uri: post.imageUrl}}
                style={styles.img}
                resizeMode="contain"
              />
            )}
            <Card.Content style={styles.content}>
              <Text variant="bodyLarge">{post.content}</Text>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button
                icon={liked ? 'cards-heart' : 'cards-heart-outline'}
                mode="outlined"
                onPress={() => handleLikePress(post.id)}
                textColor={colors.primary}>
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
                <Badge
                  style={[styles.badge, {backgroundColor: colors.primary}]}
                  size={35}>
                  {post.commentCount || 0}
                </Badge>
                <Button
                  mode="outlined"
                  icon="comment-text-multiple"
                  onPress={() => handleCommentPress(post.id)}
                  style={{paddingLeft: 34}}
                  children={undefined}
                />
              </View>
            </Card.Actions>
          </Card>
        </>
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
          <HomeSkeleton direction={'left'} />
          <HomeSkeleton direction={'right'} />
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
          Comment
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
    //backgroundColor: '#F0E7FF',
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
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    marginVertical: 2,
    height: 400,
    backgroundColor: 'white',
  },
  content: {
    paddingVertical: 10,
    //backgroundColor: '#F0E7FF',
    borderRadius: 15,
    marginTop: 5,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    //backgroundColor: '#F0E7FF',
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
    top: 3,
    left: 0,
    fontWeight: '400',
    color: 'black',
    fontSize: 15,
  },
});

export default HomeScreen;
