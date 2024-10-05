import React from 'react';
import { Button, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from '../utils/tokenUtils';

const HomePage = ({ navigation }) => {

  const handleLogout = async () => {
    await AsyncStorage.removeItem('jwtToken');
    navigation.navigate('Login');
  };

  return (
    <View>
      <Text>Ahoy! Welcome to the treasure cove!</Text>
      <Button title="Abandon Ship (Logout)" onPress={() => signOut(navigation)} />
    </View>
  );
};

export default HomePage;