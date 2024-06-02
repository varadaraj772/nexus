/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const DetailedChatScreen = ({route, navigation}) => {
  const {chatRoomId, usermail, imageurl, UserName} = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log('useeffct is woking');
    const messagesRef = firestore()
      .collection('chatRooms')
      .doc(chatRoomId)
      .collection('messages')
      .orderBy('createdAt', 'desc');
    const unsubscribe = messagesRef.onSnapshot(querySnapshot => {
      const messagesFirestore = querySnapshot
        .docChanges()
        .filter(({type}) => type === 'added')
        .map(({doc}) => {
          const message = doc.data();
          return {
            _id: doc.id,
            text: message.text,
            createdAt: message.createdAt
              ? message.createdAt.toDate()
              : new Date(),
            user: message.user,
          };
        });
      appendMessages(messagesFirestore);
    });

    return () => unsubscribe();
  }, [chatRoomId]);

  const appendMessages = useCallback(
    messages => {
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, messages),
      );
    },
    [messages],
  );
  console.log(messages);
  const handleSend = async (newMessages = []) => {
    console.log(newMessages);
    const writes = newMessages.map(m => {
      return firestore()
        .collection('chatRooms')
        .doc(chatRoomId)
        .collection('messages')
        .add({
          text: m.text,
          createdAt: firestore.FieldValue.serverTimestamp(),
          user: m.user,
        });
    });
    console.log(writes);
    await Promise.all(writes);
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={handleSend}
        user={{
          _id: usermail,
          name: UserName,
          avatar: imageurl,
        }}
      />
    </View>
  );
};

export default DetailedChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
