import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { sendAuthCode, signUp } from '../utils/tokenUtils';

const SignupPage = ({ navigation }) => {
  const [address, setAddress] = useState('');
  const [adressDetail, setAddressDetail] = useState('');
  const [type, setType] = useState('');
  const [errors, setErrors] = useState({}); 
  const [isFormValid, setIsFormValid] = useState(false); 

  const addressInputRef = useRef();
  const addressDetailInputRef = useRef();
  const typeInputRef = useRef();

  useEffect(() => {
    addressInputRef.current.focus();
  }, [])

  useEffect(() => { 
    validateForm();
  }, [address, adressDetail, type]);

  function validateForm() { 
    const errors = {};
    if (!type) { 
      errors.message = '핸드폰번호는 필수 입력입니다.'; 
    }
    if (!address) {
        errors.message = '주소는 필수 입력입니다.'; 
    }

    // Set the errors and update form validity 
    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0); 
  };
  return (
    <View style={styles.container}>
      <View style={styles.formArea}>
        <View style={styles.formAddress}>
          <TextInput
            style={textAddress}
            placeholder={'주소'}
            ref={addressInputRef}
            returnKeyType="next"
            onSubmitEditing={() =>
              adressDetail.current && adressDetail.current.focus()
            }
            mode="outlined"
            label="주소"
            value={userId}
            onChangeText={setAddress}
          />
          <Button style={styles.sendAuthCode} title="인증코드 전송" onPress={() => sendAuthCode(address)} />
        </View>
        <TextInput
          style={textAddress}
          placeholder={'상세주소'}
          ref={addressDetailInputRef}
          returnKeyType="next"
          onSubmitEditing={() =>
            typeInputRef.current && typeInputRef.current.focus()
          }
          mode="outlined"
          label="상세주소"
          value={userId}
          onChangeText={setAddressDetail}
        />
      </View>

      <View style={{flex: 0.5, justifyContent: 'center'}}>
      {!isFormValid ? (
        <Text style={styles.TextValidation}>
          {errors.message}
        </Text>
      ) : null}
      </View>
      {/* <Button
        style={{color: 'white', fontSize: wp('4%')}}
        title="회원가입"
        disabled={!isFormValid}
        onPress={() => signUp(address, adressDetail, type, authCode, password, navigation)}
      >
      </Button> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textAddress: {
    width: '200px',
    marginBottom: '25px',
  },
  formArea: {
    flex: 1
  },
  formAddress: {
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