/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthStackNavigator from './src/auth/AuthStackNavigator';
import Toast from 'react-native-toast-message';
import 'react-native-get-random-values';
import { Provider as PaperProvider } from 'react-native-paper';

const TIME_TO_WAIT_FOR_INACTIVITY_MS = 1000 * 60 * 1000;
const INACTIVITY_CHECK_INTERVAL_MS = 500;

class App extends Component {
  render(){
    return (
      <>
        <View
        style={{ flex: 1 }}>
          <PaperProvider>
            <NavigationContainer>
              <AuthStackNavigator />
            </NavigationContainer>
          </PaperProvider>
          <Toast />
        </View>
      </>
    );
  }
};

export default App;
