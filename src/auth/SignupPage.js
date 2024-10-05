import React, { useState, useRef, useEffect } from 'react';
import { Button, Text, TextInput, View, TouchableOpacity, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { sendAuthCode, signUp } from '../utils/tokenUtils';

const SignupPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordChk, setPasswordChk] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  const [phoneMask, setphoneMask] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [errors, setErrors] = useState({}); 
  const [isFormValid, setIsFormValid] = useState(false); 

  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [errortext2, setErrortext2] = useState('');
  const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);

  const emailInputRef = useRef();
  const codeInputRef = useRef();
  const passwordInputRef = useRef();
  const passwordChkInputRef = useRef();
  const nameInputRef = useRef();
  const phoneInputRef = useRef();

  useEffect(() => {
    emailInputRef.current.focus();
  }, [])

  useEffect(() => { 
    validateForm(); 
  }, [email, authCode, userName, phoneNumber, password, passwordChk]);

  function onPhoneChanged(value) {
    value = value.replace(/[^0-9]/g, '')
    setphoneNumber(value);
    value = value.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
      .replace(/(-{1,2})$/g, '');
    setphoneMask(value);
  };

  function validateForm() { 
    const errors = {}; 
    if (password !== passwordChk){
      errors.message = '비밀번호가 일치하지 않습니다.'; 
    }
    if (!password) { 
      errors.message = '비밀번호를 입력하세요.'; 
    } else if (password.length < 8) { 
        errors.message = '비밀번호는 최소 8자 이상 입력해주세요.'; 
    }
    if (!phoneNumber) { 
      errors.message = '핸드폰번호는 필수 입력입니다.'; 
    }
    if (!userName) { 
      errors.message = '닉네임은 필수 입력입니다.'; 
    }
    if (!authCode) {
      errors.message = '인증코드는 필수 입력입니다. 입력하신 E-Mail로 인증코드를 발송해주세요.'; 
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
    // <View>
    //   <TextInput placeholder="E-mail" onChangeText={setEmail} />
    //   <TextInput placeholder="Password" secureTextEntry={true} onChangeText={setPassword} />
    //   <Button title="Login" onPress={() => signIn(email, password, navigation)} />
    // </View>
    <View style={styles.container}>
      <View style={styles.formArea}>
        <View style={styles.formEmail}>
          <TextInput
            style={{width: 290}}
            placeholder={'E-Mail'}
            onChangeText={setEmail}
            ref={emailInputRef}
            returnKeyType="next"
            onSubmitEditing={() =>
              codeInputRef.current && codeInputRef.current.focus()
            }
            blurOnSubmit={false}
          />
          <Button style={styles.sendAuthCode} title="인증코드 전송" onPress={() => sendAuthCode(email)} />
        </View>
        <TextInput
          placeholder={'보안코드를 입력하세요'}
          onChangeText={setAuthCode}
          ref={codeInputRef}
          returnKeyType="next"
          onSubmitEditing={() =>
            nameInputRef.current && nameInputRef.current.focus()
          }
          blurOnSubmit={false}
        />
        <TextInput
          placeholder={'닉네임'}
          onChangeText={setUserName}
          ref={nameInputRef}
          returnKeyType="next"
          onSubmitEditing={() =>
            phoneInputRef.current && phoneInputRef.current.focus()
          }
          blurOnSubmit={false}
        />
        <TextInput
          placeholder={'휴대전화번호'}
          value={phoneMask}
          onChangeText={onPhoneChanged}
          keyboardType="number-pad"
          ref={phoneInputRef}
          returnKeyType="next"
          onSubmitEditing={() =>
            passwordInputRef.current && passwordInputRef.current.focus()
          }
          blurOnSubmit={false}
        />
        <TextInput
          secureTextEntry={true}
          placeholder={'비밀번호(8자 이상)'}
          onChangeText={setPassword}
          ref={passwordInputRef}
          returnKeyType="next"
          onSubmitEditing={() =>
            passwordChkInputRef.current && passwordChkInputRef.current.focus()
          }
          blurOnSubmit={false}
        />
        <TextInput
          secureTextEntry={true}
          placeholder={'비밀번호 확인'}
          onChangeText={setPasswordChk}
          ref={passwordChkInputRef}
          returnKeyType="next"
          onSubmitEditing={() =>
            nameInputRef.current && nameInputRef.current.focus()
          }
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
        title="회원가입"
        disabled={!isFormValid}
        onPress={() => signUp(email, userName, phoneNumber, authCode, password, navigation)}
      >
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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

export default SignupPage;