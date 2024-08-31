/* eslint-disable */
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  RefreshControl,
  Modal,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  ActivityIndicator,
  Text,
  Avatar,
  Button,
  TextInput,
  Divider,
  Snackbar,
  Card,
} from 'react-native-paper';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import { MasonryFlashList } from '@shopify/flash-list';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); 
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [message, setMessage] = useState('');
  const user = auth().currentUser;

  const isFocused = useIsFocused();

  const handleError = error => {
    console.error('Error:', error);
    setMessage('An error occurred. Please try again.');
    setSnackbarVisible(true);
  };

  useEffect(() => {
    if (isFocused) {
      fetchUserData();
      fetchUserPosts();
    }
  }, [isFocused]);

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
        setRefreshing(true);
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
      } finally {
        setRefreshing(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      await firestore().collection('users').doc(user.uid).update(editedData);
      setUserData(editedData);
      setIsEditing(false);
      setIsModalVisible(false);
      setMessage('Profile updated successfully!');
      setSnackbarVisible(true);
    } catch (error) {
      handleError(error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsEditModalVisible(false);
  };

  const SignOut = () => {
    auth().signOut();
    navigation.replace('Welcome');
  };

  const handlePostLongPress = (post) => {
    setSelectedPost(post);
    setIsModalVisible(true);
  };

  const renderPost = ({ item }) => (
    <TouchableOpacity 
      style={styles.postContainer} 
      onLongPress={() => handlePostLongPress(item)} 
    >
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.postImage}
          resizeMode="contain"
        />
      )}
    </TouchableOpacity>
  );

  if (isLoading || !userData) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchUserPosts} />
        }
      >
        <View style={styles.headerContainer}>
          <Avatar.Image size={100} source={{ uri: userData?.imageurl }} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userData?.UserName}</Text>
            <Text style={styles.userFullName}>{userData?.FullName}</Text>
            <Text style={styles.userEmail}>{userData?.Email}</Text>
          </View>
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={() => setIsEditModalVisible(true)}
              style={styles.editButton}
            >
              Edit Profile
            </Button>
            <Button
              mode="outlined"
              onPress={SignOut}
              style={styles.signOutButton}
            >
              Sign Out
            </Button>
          </View>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.tabsContainer}>
          <Button mode="text" onPress={() => {}}>Posts</Button>
          <Button mode="text" onPress={() => {}}>Saved</Button>
          <Button mode="text" onPress={() => {}}>Tagged</Button>
        </View>
        <MasonryFlashList
          data={posts}
          renderItem={renderPost}
          keyExtractor={item => item.id}
          numColumns={2}
          estimatedItemSize={150} 
          contentContainerStyle={styles.masonryContainer}
        />
      </ScrollView>
      <Modal
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
            mode='outlined'
              style={styles.input}
              value={editedData.FullName}
               placeholder="Name"
              onChangeText={text =>
                setEditedData({ ...editedData, FullName: text })
              }
            />
            <TextInput
             mode='outlined'
              style={styles.input}
              value={editedData.Email}
              onChangeText={text =>
                setEditedData({ ...editedData, Email: text })
              }
              placeholder="Email"
            />
            <TextInput
             mode='outlined'
              style={styles.input}
              value={editedData.UserName}
              onChangeText={text =>
                setEditedData({ ...editedData, UserName: text })
              }
              placeholder="Username"
            />
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.saveButton}
            >
              Save
            </Button>
            <Button
              mode="outlined"
              onPress={handleCancel}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
      <Modal
        //transparent={true}
        visible={!!selectedPost} 
        onRequestClose={() => setSelectedPost(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedPost && (
              <Card style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text variant="titleLarge" style={styles.username}>
                    {selectedPost.userName}
                  </Text>
                  <Text
                    variant="labelMedium"
                    style={[styles.timestamp, styles.alignRight]}
                  >
                    {moment(selectedPost.createdAt.toDate()).format('MMMM Do YYYY, h:mm a')}
                  </Text>
                </View>
                {selectedPost.imageUrl && (
                  <Card.Cover source={{ uri: selectedPost.imageUrl }} style={styles.img} />
                )}
                <Card.Content style={styles.content}>
                  <Text variant="bodyLarge">{selectedPost.content}</Text>
                </Card.Content>
                <Button onPress={() => setSelectedPost(null)}>Close</Button>
              </Card>
            )}
          </View>
        </View>
      </Modal>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {message}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userFullName: {
    fontSize: 16,
    color: '#666',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  editButton: {
    marginVertical: 4,
  },
  signOutButton: {
    marginVertical: 4,
  },
  divider: {
    marginVertical: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  masonryContainer: {
    paddingHorizontal: 16,
  },
  postContainer: {
    marginBottom: 16,
  },
  postImage: {
    width: '100%',
    height:200,
    borderRadius: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '95%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    color:"black"
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  saveButton: {
    marginVertical: 8,
  },
  cancelButton: {
    marginVertical: 8,
  },
  card: {
    width: '100%',
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  username: {
    fontWeight: 'bold',
  },
  timestamp: {
    color: '#888',
  },
  alignRight: {
    textAlign: 'right',
  },
  img: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 8,
  },
});

export default ProfileScreen;
