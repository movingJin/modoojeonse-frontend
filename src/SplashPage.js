import React, { useEffect } from 'react';
import { Text, View, } from 'react-native';
import { verifyTokens } from '../src/utils/tokenUtils';

const SplashPage = ({navigation}) => {
    useEffect(()=>{
      const timer = setTimeout(() => {
        verifyTokens(navigation);
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    },[])
    
  return (
    <View style ={{padding: 50}}>
      <Text style={{padding: 10, fontSize: 42}}>SPLASH</Text>
    </View>
    );
}

export default SplashPage;