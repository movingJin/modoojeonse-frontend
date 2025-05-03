import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { withdraw } from '../utils/tokenUtils';
import globalStyle from "../styles/globalStyle"

const WithdrawPage = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [errors, setErrors] = useState({}); 
  const [isFormValid, setIsFormValid] = useState(false); 

  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [errortext2, setErrortext2] = useState('');
  const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);

  const codeInputRef = useRef();
  const passwordInputRef = useRef();

  useEffect(() => {
    passwordInputRef.current.focus();
  }, [])

  useEffect(() => { 
    validateForm(); 
  }, [password]);

  function validateForm() { 
    const errors = {};
    if (!password) { 
      errors.message = '로그인된 계정의 비밀번호를 입력하세요.'; 
    }
    // Set the errors and update form validity 
    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0); 
  };
  return (
    <View style={styles.container}>
      <View style={styles.formArea}>
        <TextInput
          style={globalStyle.textInput}
          label="비밀번호 입력"
          value={password}
          mode="outlined"
          secureTextEntry={true}
          onChangeText={setPassword}
          ref={passwordInputRef}
          returnKeyType="next"
          blurOnSubmit={false}
        />
      </View>

      <View style={{flex: 0.5, justifyContent: 'center'}}>
      {!isFormValid ? (
        <Text style={styles.TextValidation}>
          {errors.message}
        </Text>
      ) : null}
      </View>
      <Button
        style={{alignSelf: 'center', width: '20%'}}
        mode="contained"
        disabled={!isFormValid}
        onPress={() => withdraw(password, navigation)}
      > 회원탈퇴
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  formArea: {
    flex: 1
  },
  TextValidation: {
    fontSize:24,
    fontWeight:'bold',
    textAlign:'center',
    paddingBottom:16
  }
})

export default WithdrawPage;