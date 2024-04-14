/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet} from 'react-native';
import {Avatar, Button, Card, Divider, Text} from 'react-native-paper';

const HomeScreen = () => {
  return (
    <Card>
      <Card.Content>
        <Text variant="titleLarge">UserName</Text>
      </Card.Content>
      <Card.Cover source={{uri: 'https://picsum.photos/700'}} />
      <Card.Content>
        <Text variant="bodyLarge">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aliquam
          pariatur, doloremque voluptatibus laboriosam sequi nihil aperiam
          eaque, similique alias at ut sapiente modi asperiores animi maiores
          eum veritatis tenetur sint.
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button icon="fire" mode="contained-tonal">
          Yaass!
        </Button>
        <Button icon="comment-quote" mode="contained-tonal">
          Gush
        </Button>
        <Button icon="share-variant-outline" mode="contained-tonal">
          Share
        </Button>
      </Card.Actions>
    </Card>
  );
};

export default HomeScreen;
