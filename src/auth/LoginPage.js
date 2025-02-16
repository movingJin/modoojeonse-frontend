import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
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
        style={{alignSelf: 'center', width: '100%'}}
        mode="contained"
        disabled={!isFormValid}
        onPress={() => signIn(email, password, navigation)} >
        로그인
      </Button>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.underButtons]}
          onPress={() => navigation.navigate('FindEmail')}>
          <Text style={styles.buttonText}>Email(ID)찾기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.underButtons]}
          onPress={() => navigation.navigate('FindPwd')}>
          <Text style={styles.buttonText}>비밀번호찾기</Text>
        </TouchableOpacity>
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
  },
  underButtons: {
    width: wp('50%'),
    height: hp('5%'),
    paddingLeft: wp('2%'),
    margin: 1,
    backgroundColor: 'rgba(52, 52, 52, 0)',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  buttonText: {
    color: 'black'
  }
})

export default LoginPage;