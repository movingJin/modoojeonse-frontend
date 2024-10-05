/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component, createRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStackNavigator from './src/auth/AuthStackNavigator';
import {View} from 'react-native';
import authStore from './src/utils/authStore';
import { signOut } from './src/utils/tokenUtils';

class App extends Component {

  constructor(props) {
    super(props);
    this.logoutTimerRef = createRef();
  }
  async componentDidMount(){
    const events = [
      "load",
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress"
    ];
    
    const resetTimer = () => {
      clearTimeout(this.logoutTimerRef.current);
    };
    
    const handleLogoutTimer = () => {
      this.logoutTimerRef.current = setTimeout(() => {
        resetTimer();
        Object.values(events).forEach((item) => {
          window.removeEventListener(item, resetTimer);
        });
        signOut();
      }, 60 * 60000); // 1시간
    };

    const loop = setInterval(() => {
      const accessToken = authStore.getState().accessToken;
      if(accessToken !== null){
        Object.values(events).forEach((item) => {
          window.addEventListener(item, () => {
            resetTimer();
            handleLogoutTimer();
          });
        });
      }else{
        resetTimer();
      }
    }, 1000)
  }

  render(){
    return (
      <>
        <View style={{ flex: 1 }}>
          <NavigationContainer>
              <AuthStackNavigator />
          </NavigationContainer>
        </View>
      </>
    );
  }
};

export default App;