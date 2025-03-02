import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import authStore from './authStore';
import { StackActions } from '@react-navigation/native';
import Config from "react-native-config";

const URL = Config.API_SERVER_URL;

const showToast = (type, text) =>{
    Toast.show({
        type: type,
        position: 'bottom',
        text1: text,
      });
};

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
      if(error.response.status === 401){
          showToast("error", "패스워드가 올바르지 않거나 등록되지 않은 사용자입니다.");
      }
      else{
          showToast("error", "Ukown error");
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
      showToast("error", "이용자정보가 올바르지 않습니다.");
    }
  }
};

export const sendAuthCode = async (email) => {
  try {
    const response = await axios.post(`${URL}/emails/send-authcode`, {email});
    if (response.status === 200){
      showToast("success", `${email} 로 인증코드를 전송했습니다. 30분 내로 메일이 도착합니다.`);
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
      showToast("success", "회원가입이 완료되었습니다!");
      const popAction = StackActions.pop();
      navigation.dispatch(popAction);
      navigation.navigate('Login');
    }
  }catch (error) {
    if(error.response.data.message === "Member already registered."){
      showToast("error", "이미 등록된 E-Mail 입니다.");
    }else if(error.response.data.message === "Auth code is not valid."){
      showToast("error", "인증코드가 유효하지 않습니다.");
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
      showToast("error", "등록되지 않은 이용자정보입니다.");
    }
    if(error.response.data.message === "Auth code is not valid."){
      showToast("error", "인증코드가 유효하지 않습니다.");
    }
  }
};

export const findPwd = async (email, phone, code, navigation) => {
  try {
    const response = await axios.post(`${URL}/find-pwd`, {email, phone, code});
    console.log(response);
    if (response.status === 200){
      showToast("success", "가입된 E-Mail로 임시비밀번호가 발송되었습니다!");
      navigation.navigate('Login');
    }
  }catch (error) {
    console.log(error.response);
    if (error.response.status === 401){
      showToast("error", "등록되지 않은 이용자정보입니다.");
    }
    if(error.response.data.message === "Auth code is not valid."){
      showToast("error", "인증코드가 유효하지 않습니다.");
    }
  }
};

export const modifyInfo = async (name, phone, navigation) => {
  try {
    const accessToken = authStore.getState().accessToken;
    const response = await axios.post(`${URL}/user/modify-info`, {name, phone}, {headers: {'Authorization': "Bearer " + accessToken}});
    if (response.status === 200){
      showToast("success", "회원정보가 수정되었습니다.");
      setName(response.data.name);
      setPhone(response.data.phone);
      navigation.goBack();
    }
  }catch (error) {
    console.log(error.response);
    if (error.response.status === 401){
      showToast("error", "이용자정보가 올바르지 않습니다.");
    }
  }
};

export const modifyPwd = async (oldPassword, newPassword, navigation) => {
  try {
    const accessToken = authStore.getState().accessToken;
    const response = await axios.post(`${URL}/user/modify-pwd`, {oldPassword, newPassword}, {headers: {'Authorization': "Bearer " + accessToken}});
    if (response.status === 200){
      showToast("success", "비밀번호가 변경되었습니다.");
      navigation.goBack();
    }
  }catch (error) {
    console.log(error.response);
    if (error.response.status === 401){
      showToast("error", "이용자정보가 올바르지 않습니다.");
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
    showToast("error", "로그인 정보가 없습니다.");
  }
  // 로컬 스토리지에 Token데이터가 있으면 -> 토큰들을 헤더에 넣어 검증 
  else{
    const headers_config = {
      'Authorization': `dummy token to reissue`,
      'Refresh-Token': `Bearer ${refreshToken}`  
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
        showToast("error", "로그인정보가 만료되었습니다.");
      }
      else{
        showToast("error", "Ukown error");
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
      showToast("success", "회원탈퇴 되었습니다.");
      navigation.reset({routes: [{name: "Main"}]});
    }
  }catch (error) {
    console.log(error.response);
    if (error.response.status === 401){
      showToast("error", "이용자정보가 올바르지 않습니다.");
    }
  }
};

export const saveGeoPoint = async (body, setIsFinished) => {
  const accessToken = authStore.getState().accessToken;
  axios.post(`${URL}/geo/save`, body, {headers: {'Authorization': "Bearer " + accessToken}}).then((response)=>{
    if (response.status === 200){
      showToast("success", "입력한 주소지가 등록되었습니다.");
    }
  })
  .catch(error => {
    if(error.response.data.message === "Address already registered."){
      showToast("error","이미 등록된 주소 입니다.");
    }else{
      showToast("error", error);
    }
  })
  .finally(() => {
    setIsFinished(true);
  });
};

export const findReviews = async (params, setReviews) => {
  axios.get(`${URL}/review/search-native`, {params}).then((response)=>{
    if (response.status === 200){
      setReviews(response.data);
    }
  })
  .catch(error => {
    console.log(error);
  })
  .finally(() => {

  });
};

export const findReviewById = async (params, setReview) => {
  const accessToken = authStore.getState().accessToken;
  axios.get(`${URL}/review/search-id`, {params, headers: {'Authorization': "Bearer " + accessToken}}).then((response)=>{
    if (response.status === 200){
      setReview(response.data);
    }
  })
  .catch(error => {
    console.log(error);
  })
  .finally(() => {

  });
};

export const saveReview = async (body, setIsLoading, setIsFinished) => {
  const accessToken = authStore.getState().accessToken;
  axios.post(`${URL}/review/save`, body, {headers: {'Authorization': "Bearer " + accessToken}}).then((response)=>{
    if (response.status === 200){
      setIsFinished(true);
      showToast("success", "후기가 등록되었습니다.");
    }
  })
  .catch(error => {
    if(error.response.data.message === "Review is already registered."){
      showToast("error","이미 등록하신 후기 입니다.");
    }else{
      showToast("error", error);
    }
  })
  .finally(() => {
    setIsLoading(false);
  });
};

export const editReview = async (body, setIsLoading, setIsFinished) => {
  const accessToken = authStore.getState().accessToken;
  axios.post(`${URL}/review/edit`, body, {headers: {'Authorization': "Bearer " + accessToken}}).then((response)=>{
    if (response.status === 200){
      setIsFinished(true);
      showToast("success", "후기가 수정되었습니다.");
    }
  })
  .catch(error => {
    if(error.response.data.message === "Review is not found."){
      showToast("error","등록되지 않은 후기 입니다.");
    }else{
      showToast("error", error);
    }
  })
  .finally(() => {
    setIsLoading(false);
  });
};

export const deleteReview = async (body, setIsFinished) => {
  const accessToken = authStore.getState().accessToken;
  axios.post(`${URL}/review/delete`, body, {headers: {'Authorization': "Bearer " + accessToken}}).then((response)=>{
    if (response.status === 200){
      setIsFinished(true);
      showToast("success", "후기가 삭제되었습니다.");
    }
  })
  .catch(error => {
    if(error.response.data.message === "Review is not found."){
      showToast("error","등록되지 않은 후기 입니다.");
    }else{
      showToast("error", error);
    }
  })
  .finally(() => {

  });
};