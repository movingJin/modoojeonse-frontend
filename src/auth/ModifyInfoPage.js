import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { modifyInfo } from '../utils/tokenUtils';
import authStore from '../utils/authStore';
import { Text, TextInput, Button } from 'react-native-paper';
import globalStyle from "../styles/globalStyle"

const ModifyInfoPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  const [phoneMask, setphoneMask] = useState('');
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
    const email = authStore.getState().email;
    const name = authStore.getState().name;
    const phone = authStore.getState().phone;
    setEmail(email);
    setUserName(name);
    setphoneNumber(phone);
    if(phone){
      setphoneMask(phone.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3'));
    }
  }, []);

  useEffect(() => { 
    validateForm();
  }, [userName, phoneNumber]);

  function onPhoneChanged(value) {
    value = value.replace(/[^0-9]/g, '')
    setphoneNumber(value);
    value = value.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
      .replace(/(-{1,2})$/g, '');
    setphoneMask(value);
  };

  function validateForm() { 
    const errors = {};
    if (!phoneNumber) { 
      errors.message = '핸드폰번호는 필수 입력입니다.'; 
    }
    if (!userName) {
      errors.message = '닉네임은 필수 입력입니다.'; 
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
          label="E-Mail"
          value={email}
          mode="outlined"
          ref={emailInputRef}
          editable = {false}
        />
        <TextInput
          style={globalStyle.textInput}
          label="닉네임"
          value={userName}
          mode="outlined"
          onChangeText={setUserName}
          ref={nameInputRef}
          returnKeyType="next"
          onSubmitEditing={() =>
            phoneInputRef.current && phoneInputRef.current.focus()
          }
          blurOnSubmit={false}
        />
        <TextInput
          style={[globalStyle.textInput]}
          label="휴대전화번호"
          value={phoneMask}
          mode="outlined"
          onChangeText={onPhoneChanged}
          keyboardType="number-pad"
          ref={phoneInputRef}
          returnKeyType="next"
          onSubmitEditing={() =>
            passwordInputRef.current && passwordInputRef.current.focus()
          }
          blurOnSubmit={false}
        />
        <Button
          style={[globalStyle.commonButton, {width: '100%'}]}
          mode="contained"
          onPress={() => navigation.navigate('ModifyPwd')} >
          비밀번호 재설정
        </Button>
        <View style={{flex: 0.5, justifyContent: 'center'}}>
        {!isFormValid ? (
          <Text style={styles.TextValidation}>
            {errors.message}
          </Text>
        ) : null}
        </View>
        <Button
          style={[globalStyle.commonButton, {width: '100%'}]}
          mode="contained"
          disabled={!isFormValid}
          onPress={() => modifyInfo(userName, phoneNumber, navigation)}
        >
          수정완료
        </Button>
      </View>
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

export default ModifyInfoPage;