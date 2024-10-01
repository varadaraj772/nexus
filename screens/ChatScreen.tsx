/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {ActivityIndicator, Avatar, Button, Text} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Skeleton from '../skeletons/Skeleton';

const ChatScreen = ({navigation}) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const currentUser = auth().currentUser;

  const fetchChatRooms = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const userDoc = await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .get();
      const userData = userDoc.data();
      setUser(userData);
      const chatRoomsRef = firestore().collection('chatRooms');
      const querySnapshot = await chatRoomsRef
        .where('participants', 'array-contains', currentUser.uid)
        .get();

      const chatRoomsData = await Promise.all(
        querySnapshot.docs.map(async doc => {
          const chatRoomData = doc.data();
          const otherUserId = chatRoomData.participants.find(
            (id: string) => id !== currentUser.uid,
          );
          const userDoc = await firestore()
            .collection('users')
            .doc(otherUserId)
            .get();
          const userData = userDoc.data();
          return {id: doc.id, ...chatRoomData, userData};
        }),
      );

      setChatRooms(chatRoomsData);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    }
    setLoading(false);
    setRefreshing(false);
  };
  useEffect(() => {
    fetchChatRooms();
  }, []);

  const handleChatRoomPress = (
    chatRoomId: any,
    usermail: any,
    imageurl: any,
    UserName: any,
  ) => {
    navigation.navigate('DetailedChat', {
      chatRoomId,
      usermail,
      imageurl,
      UserName,
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
       <Skeleton/>
      ) : (
        <FlatList
          data={chatRooms}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchChatRooms}
            />
          }
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                handleChatRoomPress(
                  item.id,
                  user.Email,
                  user.imageurl,
                  user.UserName,
                )
              }>
              <View style={styles.chatRoom}>
                {item.userData.imageurl && (
                  <Avatar.Image
                    source={{uri: item.userData.imageurl}}
                    style={styles.profile}
                  />
                )}
                <Text style={styles.nameText}>@{item.userData.UserName}</Text>
                <Text style={styles.usernameText}>
                  {item.userData.FullName}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={styles.noChatText}>No chats available</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  activityIndicator: {
    marginTop: 20,
  },
  chatRoom: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  usernameText: {
    fontSize: 14,
    color: '#888',
  },
  profile: {
    marginRight: 10,
  },
  noChatText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default ChatScreen;
