/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {ActivityIndicator, Avatar, Searchbar, Text} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {Image} from 'react-native';

const debounce = (
  func: {(searchTerm: any): Promise<void>; (arg0: any): void},
  delay: number | undefined,
) => {
  let timeoutId: string | number | NodeJS.Timeout | undefined;
  return (...args: any) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [usernames, setUsernames] = useState([]);

  const debouncedFetchUsers = debounce(async searchTerm => {
    if (!searchTerm) {
      setUsernames([]);
      return '';
    }
    try {
      const usersRef = firestore().collection('users');
      const querySnapshot = await usersRef
        .where('FullName', '==', searchTerm.toUpperCase())
        .get();
      const fetchedUsers = querySnapshot.docs.map(doc => doc.data());
      setUsernames(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, 500);

  useEffect(() => {
    debouncedFetchUsers(searchTerm);
  }, [debouncedFetchUsers, searchTerm]);

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
      {usernames.length > 0 ? (
        <FlatList
          data={usernames}
          renderItem={({item}) => (
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
          )}
        />
      ) : (
        searchTerm && (
          <ActivityIndicator
            size="large"
            animating={true}
            style={styles.activityIndicator}
          />
        )
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
});

export default SearchScreen;
