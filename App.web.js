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
import { View } from 'react-native';
import authStore from './src/utils/authStore';
import { signOut } from './src/utils/tokenUtils';
import { Provider as PaperProvider } from 'react-native-paper';

class App extends Component {
  constructor(props) {
    super(props);
    this.logoutTimerRef = createRef();
    this.navigationRef = createRef();
    
    // URL 파라미터 저장을 위한 state
    this.state = {
      oauth2Params: null
    };
  }

  componentDidMount() {
    // navigationRef를 전역적으로 사용할 수 있게 설정
    if (typeof window !== 'undefined') {
      window.navigationRef = this.navigationRef;
    }

    // 자동 로그아웃 타이머 설정
    const events = ["load", "mousemove", "mousedown", "click", "scroll", "keypress"];
    
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
      }, 60 * 60000);
    };

    // URL 파라미터 체크
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      if (path === '/oauth2/redirect') {
        const oauth2Params = {
          email: params.get('email'),
          code: params.get('code')
        };
        this.setState({ oauth2Params }, () => {
          // 바로 네비게이션 트리거
          this.navigationRef.current?.navigate('OAuth2Redirect', oauth2Params);
          this.setState({ oauth2Params: null });
        });
      }
    }

    // 토큰 상태 체크 인터벌
    const loop = setInterval(() => {
      const accessToken = authStore.getState().accessToken;
      if (accessToken !== null) {
        Object.values(events).forEach((item) => {
          window.addEventListener(item, () => {
            resetTimer();
            handleLogoutTimer();
          });
        });
      } else {
        resetTimer();
      }
    }, 1000);

    return () => clearInterval(loop);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <PaperProvider>
          <NavigationContainer
            ref={this.navigationRef}
          >
            <AuthStackNavigator />
          </NavigationContainer>
        </PaperProvider>
      </View>
    );
  }
}

export default App;