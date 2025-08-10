import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
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
        style={[globalStyle.commonButton, {width: '100%'}]}
        mode="contained"
        disabled={!isFormValid}
        onPress={() => signIn(email, password, navigation)} >
        로그인
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