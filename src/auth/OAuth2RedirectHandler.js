import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { signInOAuth } from '../utils/tokenUtils';

const OAuth2RedirectHandler = ({ route, navigation }) => {
  useEffect(() => {
    const handleOAuth2Redirect = async () => {
      try {
        const { email, code } = route.params || {};
        
        if (!code) {
          console.error('No auth code received');
          navigation.navigate('Login');
          return;
        }
        // navigation 객체 직접 전달
        await signInOAuth(email, code, navigation);
      } catch (error) {
        console.error('OAuth2 token exchange failed:', error);
        navigation.navigate('Login');
      }
    };
    handleOAuth2Redirect();
  }, [route.params, navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>로그인 처리중...</Text>
    </View>
  );
};

export default OAuth2RedirectHandler;