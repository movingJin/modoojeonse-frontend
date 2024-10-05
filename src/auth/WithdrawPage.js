import React, { useState, useRef, useEffect } from 'react';
import { Button, Text, TextInput, View, TouchableOpacity, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { withdraw } from '../utils/tokenUtils';

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
          secureTextEntry={true}
          placeholder={'비밀번호 입력'}
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
        style={{color: 'white', fontSize: wp('4%')}}
        title="회원탈퇴"
        disabled={!isFormValid}
        onPress={() => withdraw(password, navigation)}
      >
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
  formEmail: {
    flexDirection: 'row',
    width: wp('100%')
  },
  sendAuthCode: {
    width: wp('10%'),
    paddingLeft: wp('2%')
  },
  TextValidation: {
    fontSize:24,
    fontWeight:'bold',
    textAlign:'center',
    paddingBottom:16
  },
  wrapButton: {
    width: wp('100%'),
    height: hp('8%'),
    paddingLeft: wp('2%'),
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  }
})

export default WithdrawPage;