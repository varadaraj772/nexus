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
  IconButton,
} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = props => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = auth().currentUser;
  const handleError = error => {
    console.error('Error fetching user data or posts:', error);
    Alert.alert('Error', 'An error occurred. Please try again later.');
  };
  const fetchPosts = async () => {
    try {
      setRefreshing(true);
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
      setRefreshing(false);
    }
  };
  useEffect(() => {
    if (!user) {
    }
    fetchPosts();
  }, []);
  const renderPost = post => {
    const hasImage = !!post.imageUrl;
    const timestamp = post.createdAt;
    const dateString = timestamp.toDate().toLocaleString();
    return (
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
          <IconButton
            icon="cards-heart-outline"
            size={24}
            mode="default"
            onPress={() => {}}
            style={styles.iconLeft}
          />
          <IconButton
            icon="comment-flash-outline"
            size={24}
            mode="default"
            onPress={() => {}}
            style={styles.iconMiddle}
          />
          <IconButton
            icon="share-variant-outline"
            size={24}
            mode="default"
            onPress={() => {}}
            style={styles.iconRight}
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
    marginBottom: 20,
    borderRadius: 15,
    backgroundColor: 'white',
    padding: 5,
    margin: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
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
    height: 500,
    resizeMode: 'stretch',
    borderRadius: 0,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  content: {
    paddingVertical: 16,
    backgroundColor: '#F0E7FF',
    borderRadius: 15,
    marginTop: 5,
  },
  cardActions: {
    justifyContent: 'flex-start',
    position: 'relative',
    padding: 35,
    backgroundColor: '#F0E7FF',
    borderRadius: 15,
    marginVertical: 5,
  },
  iconLeft: {
    position: 'absolute',
    left: 0,
  },
  iconMiddle: {
    position: 'absolute',
    left: '50%',
    transform: [{translateX: 0}],
  },
  iconRight: {
    position: 'absolute',
    right: 0,
  },
});
