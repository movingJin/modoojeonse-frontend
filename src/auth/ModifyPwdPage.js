import React, { useState, useRef, useEffect } from 'react';
import { Button, Text, TextInput, View, TouchableOpacity, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { modifyPwd } from '../utils/tokenUtils';

const SignupPage = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordChk, setNewPasswordChk] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [errors, setErrors] = useState({}); 
  const [isFormValid, setIsFormValid] = useState(false); 

  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [errortext2, setErrortext2] = useState('');
  const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);

  const codeInputRef = useRef();
  const oldPasswordInputRef = useRef();
  const newPasswordInputRef = useRef();
  const newPasswordChkInputRef = useRef();

  useEffect(() => {
    oldPasswordInputRef.current.focus();
  }, [])

  useEffect(() => { 
    validateForm(); 
  }, [oldPassword, newPassword, newPasswordChk]);

  function validateForm() { 
    const errors = {};
    if (oldPassword === newPassword){
      errors.message = '사용중인 비밀번호와 같습니다.'; 
    }
    if (newPassword !== newPasswordChk){
      errors.message = '비밀번호가 일치하지 않습니다.'; 
    }
    if (!newPassword) { 
      errors.message = '변경할 비밀번호를 입력하세요.'; 
    } else if (newPassword.length < 8) { 
        errors.message = '비밀번호는 최소 8자 이상 입력해주세요.'; 
    }
    if (!oldPassword) { 
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
          placeholder={'변경전 비밀번호'}
          onChangeText={setOldPassword}
          ref={oldPasswordInputRef}
          returnKeyType="next"
          onSubmitEditing={() =>
            newPasswordInputRef.current && newPasswordInputRef.current.focus()
          }
          blurOnSubmit={false}
        />
        <TextInput
          secureTextEntry={true}
          placeholder={'새로운 비밀번호(8자 이상)'}
          onChangeText={setNewPassword}
          ref={newPasswordInputRef}
          returnKeyType="next"
          onSubmitEditing={() =>
            newPasswordChkInputRef.current && newPasswordChkInputRef.current.focus()
          }
          blurOnSubmit={false}
        />
        <TextInput
          secureTextEntry={true}
          placeholder={'새로운 비밀번호 확인'}
          onChangeText={setNewPasswordChk}
          ref={newPasswordChkInputRef}
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
        title="비밀번호 변경"
        disabled={!isFormValid}
        onPress={() => modifyPwd(oldPassword, newPassword, navigation)}
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