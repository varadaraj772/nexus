import React, {useState, useEffect} from 'react';
import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {Avatar, Searchbar, Text} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {Image} from 'react-native';
import auth from '@react-native-firebase/auth';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import SearchSkeleton from '../skeletons/SearchSkeleton';

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const SearchScreen = ({navigation}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [usernames, setUsernames] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedFetchUsers = debounce(async searchTerm => {
    if (!searchTerm) {
      setUsernames([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const usersRef = firestore().collection('users');
      const querySnapshot = await usersRef
        .orderBy('FullName')
        .startAt(searchTerm.toUpperCase())
        .endAt(searchTerm.toUpperCase() + '\uf8ff')
        .get();
      const fetchedUsers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsernames(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  }, 500);

  useEffect(() => {
    debouncedFetchUsers(searchTerm);
  }, [searchTerm]);

  const handleUserPress = async userId => {
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        const chatRoomId = await initiateChat(currentUser.uid, userId);
        navigation.navigate('Chat', {
          chatRoomId,
          userId: currentUser.uid,
        });
      }
    } catch (error) {
      console.error('Error initiating chat:', error);
    }
  };

  const initiateChat = async (userId1: string, userId2: any) => {
    const chatRoomsRef = firestore().collection('chatRooms');
    const userIds = [userId1, userId2];

    const querySnapshot = await chatRoomsRef
      .where('participants', 'array-contains', userIds[0])
      .get();

    let chatRoomId = null;

    querySnapshot.forEach(doc => {
      const data = doc.data();
      if (data.participants.includes(userIds[1])) {
        chatRoomId = doc.id;
      }
    });

    if (chatRoomId) {
      return chatRoomId;
    } else {
      const newChatRoom = await chatRoomsRef.add({
        participants: userIds,
        createdAt: new Date(),
      });
      return newChatRoom.id;
    }
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search Username"
        onChangeText={setSearchTerm}
        value={searchTerm}
      />
      {searchTerm ? (
        ''
      ) : (
        <Image source={require('../assets/search.png')} style={styles.image} />
      )}
      {loading ? (
        <>
          <SearchSkeleton direction={'left'} />
          <SearchSkeleton direction={'right'} />
          <SearchSkeleton direction={'right'} />
          <SearchSkeleton direction={'left'} />
          <SearchSkeleton direction={'right'} />
          <SearchSkeleton direction={'left'} />
        </>
      ) : (
        <FlatList
          data={usernames}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleUserPress(item.id)}>
              <View style={styles.searchResult}>
                {item.imageurl && (
                  <Avatar.Image
                    source={{uri: item.imageurl}}
                    style={styles.profile}
                  />
                )}
                <Text style={styles.nameText}>@{item.UserName}</Text>
                <Text style={styles.usernameText}>{item.FullName}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            searchTerm && !loading ? (
              <Text style={styles.noUserText}>No user found</Text>
            ) : null
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
  searchResult: {
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
  image: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
    marginTop: 40,
  },
  noUserText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default SearchScreen;
