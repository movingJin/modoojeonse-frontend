import React, { useRef } from 'react';
import customAlert from './customAlert';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import authStore from './authStore';
import { StackActions } from '@react-navigation/native';

const URL = 'http://192.168.0.3:58083'

const {
  setAccessToken,
  setRefreshToken,
  setEmail,
  setName,
  setPhone,
  setRoles,
  clearTokens} = authStore.getState();

export const signIn = async (email, password, navigation) => {
    try {
      const response = await axios.post(`${URL}/login`, { email, password });
      console.log(response.data);
      //await AsyncStorage.setItem('jwtToken', response.data.tokens.accessToken);
      if (response.status === 200){
        setAccessToken(response.data.tokens.accessToken);
        setRefreshToken(response.data.tokens.refreshToken);
        setEmail(response.data.email);
        setName(response.data.name);
        setPhone(response.data.phone);
        setRoles(response.data.roles);
        navigation.reset({routes: [{name: "Main"}]});
      }
    } catch (error) {
      console.log(error);
      if(error.response.status === 401){
        customAlert(
          "로그인실패",
          "패스워드가 올바르지 않거나 등록되지 않은 사용자입니다.",
          null
        );
      }
      else{
        console.log(error.response);
        customAlert(
          "로그인실패",
          "Unknown error",
          null
        );
      }
    }
};

export const signOut = async (setIsAuthenticated) => {
  const accessToken = authStore.getState().accessToken;
  console.log(accessToken);
  try{
    const response = await axios.post(`${URL}/user/signout`, {}, {headers: {'Authorization': "Bearer " + accessToken}});
    if (response.status === 200){
      clearTokens();
      if(setIsAuthenticated){
        setIsAuthenticated(false);
      }
    }
  }catch (error) {
    console.log(error.response);
    if (error.response.status === 401){
      customAlert(
        "로그아웃 실패",
        "이용자정보가 올바르지 않습니다.",
        null
      );
    }
  }
};

export const sendAuthCode = async (email) => {
  try {
    const response = await axios.post(`${URL}/emails/send-authcode`, {email});
    if (response.status === 200){
      customAlert(
        "인증코드 전송",
        `${email} 로 인증코드를 전송했습니다. 30분 내로 메일이 도착합니다.`,
        null
      );
    }
  }catch (error) {
    console.log(error.response);
  }
};

export const signUp = async (email, name, phone, code, password, navigation) => {
  try {
    const response = await axios.post(`${URL}/register`, {email, name, phone, code, password});
    console.log(response);
    if (response.status === 200){
      customAlert(
        "회원가입 성공",
        "회원가입이 완료되었습니다!",
        null
      );
      const popAction = StackActions.pop();
      navigation.dispatch(popAction);
      navigation.navigate('Login');
    }
  }catch (error) {
    if(error.response.data.message === "Member already registered."){
      customAlert(
        "회원가입 실패",
        "이미 등록된 E-Mail 입니다.",
        null
      );
    }else if(error.response.data.message === "Auth code is not valid."){
      customAlert(
        "회원가입 실패",
        "인증코드가 유효하지 않습니다.",
        null
      );
    }
  }
};

export const findEmail = async (phone, code, navigation) => {
  try {
    const response = await axios.post(`${URL}/find-email`, {phone, code});
    console.log(response.data);
    if (response.status === 200){
      navigation.navigate('FindEmailResult', {email: response.data});
    }
  }catch (error) {
    console.log(error.response);
    if (error.response.status === 401){
      customAlert(
        "이메일찾기 실패",
        "등록되지 않은 이용자정보입니다.",
        null
      );
    }
    if(error.response.data.message === "Auth code is not valid."){
      customAlert(
        "이메일찾기 실패",
        "인증코드가 유효하지 않습니다.",
        null
      );
    }
  }
};

export const findPwd = async (email, phone, code, navigation) => {
  try {
    const response = await axios.post(`${URL}/find-pwd`, {email, phone, code});
    console.log(response);
    if (response.status === 200){
      customAlert(
        "비밀번호찾기 성공",
        "가입된 E-Mail로 임시비밀번호가 발송되었습니다!",
        null
      );
      navigation.navigate('Login');
    }
  }catch (error) {
    console.log(error.response);
    if (error.response.status === 401){
      customAlert(
        "비밀번호찾기 실패",
        "등록되지 않은 이용자정보입니다.",
        null
      );
    }
    if(error.response.data.message === "Auth code is not valid."){
      customAlert(
        "비밀번호찾기 실패",
        "인증코드가 유효하지 않습니다.",
        null
      );
    }
  }
};

export const modifyInfo = async (name, phone, navigation) => {
  try {
    const accessToken = authStore.getState().accessToken;
    const response = await axios.post(`${URL}/user/modify-info`, {name, phone}, {headers: {'Authorization': "Bearer " + accessToken}});
    if (response.status === 200){
      customAlert(
        "회원정보수정 성공",
        "회원정보가 수정되었습니다.",
        null
      );
      setName(response.data.name);
      setPhone(response.data.phone);
      navigation.goBack();
    }
  }catch (error) {
    console.log(error.response);
    if (error.response.status === 401){
      customAlert(
        "회원정보수정 실패",
        "이용자정보가 올바르지 않습니다.",
        null
      );
    }
  }
};

export const modifyPwd = async (oldPassword, newPassword, navigation) => {
  try {
    const accessToken = authStore.getState().accessToken;
    const response = await axios.post(`${URL}/user/modify-pwd`, {oldPassword, newPassword}, {headers: {'Authorization': "Bearer " + accessToken}});
    if (response.status === 200){
      customAlert(
        "비밀번호변경 성공",
        "비밀번호가 변경되었습니다.",
        null
      );
      navigation.goBack();
    }
  }catch (error) {
    console.log(error.response);
    if (error.response.status === 401){
      customAlert(
        "비밀번호변경 실패",
        "이용자정보가 올바르지 않습니다.",
        null
      );
    }
  }
};

export const verifyTokens = async (navigation) => {
  const accessToken = authStore.getState().accessToken;
  const refreshToken = authStore.getState().refreshToken;
  clearTokens();

  console.log("accessToken: " + accessToken);
  console.log("refreshToken: " + refreshToken);
  // 최초 접속
  if (accessToken === null && refreshToken === null){
    navigation.reset({routes: [{name: "Main"}]});
  }
  // 로컬 스토리지에 Token데이터가 있으면 -> 토큰들을 헤더에 넣어 검증 
  else{
    const headers_config = {
      'Authorization': `dummy token to reissue`,
      'Refresh_Token': `Bearer ${refreshToken}`  
    };

    try {
      const response = await axios.post(`${URL}/user/refresh`, {}, {headers: headers_config});
      console.log(response.data);
      if (response.status === 200){
        setAccessToken(response.data.tokens.accessToken);
        setRefreshToken(response.data.tokens.refreshToken);
        setEmail(response.data.email);
        setName(response.data.name);
        setPhone(response.data.phone);
        setRoles(response.data.roles);
      }
    } catch (error) {
      console.log(error);
      if(error.response.status === 400){

      }
      else{

      }
    }
    navigation.reset({routes: [{name: "Main"}]});
  }
};

export const withdraw = async (password, navigation) => {
  try {
    const accessToken = authStore.getState().accessToken;
    const response = await axios.post(`${URL}/user/withdraw`, {password}, {headers: {'Authorization': "Bearer " + accessToken}});
    if (response.status === 200){
      clearTokens();
      customAlert(
        "회원탈퇴 성공",
        "회원탈퇴 되었습니다.",
        null
      );
      navigation.reset({routes: [{name: "Main"}]});
    }
  }catch (error) {
    console.log(error.response);
    if (error.response.status === 401){
      customAlert(
        "회원탈퇴 실패",
        "이용자정보가 올바르지 않습니다.",
        null
      );
    }
  }
};