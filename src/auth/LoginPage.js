import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { signIn } from '../utils/tokenUtils';
import { Text, TextInput, Button } from 'react-native-paper';
import globalStyle from "../styles/globalStyle"

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({}); 
  const [isFormValid, setIsFormValid] = useState(false); 

  const [loading, setLoading] = useState(false);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  useEffect(() => {
    emailInputRef.current.focus();
  }, [])
  
  useEffect(() => { 
    validateForm(); 
  }, [email, password]);

  function validateForm() { 
    const errors = {}; 
    if (!password) { 
      errors.message = '비밀번호를 입력하세요.'; 
    }
    if (!email) {
        errors.message = 'E-Mail은 필수 입력입니다.'; 
    } else if (!/\S+@\S+\.\S+/.test(email)) { 
        errors.message = 'E-Mail 형식이 아닙니다.'; 
    }

    // Set the errors and update form validity 
    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0); 
  };

  const handleGoogleLogin = () => {
    if (Platform.OS === 'web') {
      // Google OAuth2 인증 페이지로 리다이렉트
      const GOOGLE_AUTH_URL = `${process.env.API_SERVER_URL}/oauth2/authorization/google`;
      const REDIRECT_URI = `${process.env.API_SERVER_URL}/login/oauth2/code/google`;
      
      const googleLoginUrl = `${GOOGLE_AUTH_URL}?redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
      window.location.href = googleLoginUrl;
    } else {

    }
  };

  return (
    <View>
      <TextInput
        style={globalStyle.textInput}
        label="E-mail"
        value={email}
        mode="outlined"
        onChangeText={setEmail}
        ref={emailInputRef} />
      <TextInput
        style={globalStyle.textInput}
        label="Password"
        value={password}
        mode="outlined"
        secureTextEntry={true}
        onChangeText={setPassword}
        ref={passwordInputRef} />
      <Button
        style={[globalStyle.commonButton, {width: '100%'}]}
        mode="contained"
        disabled={!isFormValid}
        onPress={() => signIn(email, password, navigation)} >
        로그인
      </Button>
      <Button
        style={[globalStyle.commonButton, {
          width: '100%',
          marginVertical: 10,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#dadce0',
          elevation: 0
        }]}
        labelStyle={{
          color: '#757575',
          fontSize: 16,
          marginLeft: 8
        }}
        icon={() => (
          <Icon 
            name="google" 
            size={24} 
            color="#4285F4"
          />
        )}
        mode="contained"
        onPress={handleGoogleLogin}>
        Google로 로그인
      </Button>
      <View style={styles.buttonContainer}>
        <Button
          style={[globalStyle.commonButton, {width: '50%'}]}
          mode="contained"
          color="#cb9afd"
          onPress={() => navigation.navigate('FindEmail')} >
          Email(ID)찾기
        </Button>
        <Button
          style={[globalStyle.commonButton, {width: '50%'}]}
          mode="contained"
          color="#cb9afd"
          onPress={() => navigation.navigate('FindPwd')} >
          비밀번호찾기
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: wp('100%')
  }
})

export default LoginPage;