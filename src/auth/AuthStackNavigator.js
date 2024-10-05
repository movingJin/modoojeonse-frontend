import React from 'react';
import { Platform, TouchableOpacity, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import SplashPage from '../SplashPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import FindPwdPage from './FindPwdPage';
import FindEmailPage from './FindEmailPage';
import FindEmailResultPage from './FindEmailResultPage';
import ModifyInfoPage from './ModifyInfoPage';
import ModifyPwdPage from './ModifyPwdPage';
import HomeTab from '../HomeTab';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SettingPage from '../settings/SettingPage'
import About from '../settings/About';
// import { IconButton } from 'react-native-paper';

const Stack = createStackNavigator();

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={Platform.OS === 'web' ? ("Main"): ("Splash")}
      screenOptions={({ navigation }) => ({
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: '#000', fontSize: 18 }}>◀</Text>
          </TouchableOpacity>
        ),
      })}
      >
      <Stack.Screen name="Splash" options={{headerShown: false}} component={SplashPage} />
      <Stack.Screen name="Login" component={LoginPage} options={{title: '로그인'}}/>
      <Stack.Screen name="Signup" component={SignupPage} options={{title: '회원가입'}}/>
      <Stack.Screen name="FindPwd" component={FindPwdPage} options={{title: '임시비밀번호 전송'}}/>
      <Stack.Screen name="FindEmail" component={FindEmailPage} options={{title: 'E-Mail(Id) 찾기'}}/>
      <Stack.Screen name="FindEmailResult" component={FindEmailResultPage} options={{title: 'E-Mail(Id) 찾기'}}/>
      <Stack.Screen name="Main" component={HomeTab}
        options={({ navigation }) => ({
          //headerShown: false
          title: '모두의 전세',
          headerLeft: false,
          headerRight: () => (
            <Icon 
              name="settings"
              size={24}
              onPress={() => navigation.navigate('Settings')} />
          ),
        })}/>
        <Stack.Screen name="ModifyInfo" component={ModifyInfoPage} options={{title: '회원정보 수정'}}/>
        <Stack.Screen name="ModifyPwd" component={ModifyPwdPage} options={{title: '비밀번호 재설정'}}/>
      <Stack.Screen name="Settings" component={SettingPage} />
      <Stack.Screen name="About" component={About} />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;