import React, { useState, useRef, useEffect } from 'react';
import { Platform, View, TouchableOpacity, TouchableWithoutFeedback, Modal, StyleSheet, Text } from 'react-native';
import { TextInput, Button, RadioButton } from 'react-native-paper';
import Postcode from '@actbase/react-daum-postcode';
import authStore from '../utils/authStore';
import { saveGeoPoint } from '../utils/tokenUtils';
import axios from "axios";
//import customAlert from '../customAlert';
import Config from "react-native-config";
import globalStyle from "../styles/globalStyle"

const URL = 'http://192.168.0.3:58083'

const RegisterPin = ({ toggleRegister }) => {
  const [address, setAddress] = useState('');
  const [type, setType] = useState('Apartment');
  const [errors, setErrors] = useState({}); 
  const [isFormValid, setIsFormValid] = useState(false);
  const [isPostVisible, setIsPostVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(true); 

  const addressInputRef = useRef();
  const typeInputRef = useRef();

  useEffect(() => {
    addressInputRef.current?.focus();
  }, [])

  useEffect(() => { 
    validateForm();
  }, [address, type]);

  useEffect(() => {
    if(!isLoading & isFinished){
      toggleRegister(false);
    }
  }, [isFinished])

  function validateForm() { 
    const errors = {};
    if (!type) { 
      errors.message = '주거유형은 필수 입력입니다.';
    }
    if (!address) {
        errors.message = '주소는 필수 입력입니다.'; 
    }

    // Set the errors and update form validity 
    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0); 
  }

  const popupPostcode=()=>{
    return(
      <Modal
      visible={isPostVisible}
      transparent={true}
      animationType='slide'
      onRequestClose={() => setIsPostVisible(!isPostVisible)}>
        <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0)'}} onPress={() => setIsPostVisible(false)}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={globalStyle.modalWrapperStyle}>
              <Postcode
                visible={isPostVisible}
                style={{ width: '100%', height: '100%' }}
                jsOptions={{ animation: true, hideMapBtn: true }}
                onSelected={(data) => getAddressData(data)}
              />
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    )
  };

  const getAddressData = (data) => {
    let defaultAddress='';
    
    if(data.buildingName===''){
        defaultAddress='';
    }else if(data.buildingName==='N'){
        defaultAddress="("+data.apartment+")";
    }else{
        defaultAddress="("+data.buildingName+")";
    }

    setIsPostVisible(false);
    setAddress(data.address + ' ' + defaultAddress);
  }

  const saveMarker = async () => {
    setIsLoading(true);
    const apiKey = Platform.OS === "web" ? process.env.REACT_APP_GOOGLE_MAP_API: Config.REACT_APP_GOOGLE_MAP_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === "OK") {
        const ret = data.results[0].geometry.location;
        const location = {lat: ret.lat, lon: ret.lng};
        const body = {
          location,
          address,
          author: authStore.getState().email,
          type
        };
        setIsFinished(false);
        saveGeoPoint(body, setIsFinished);
      } else {
        console.log("Geocoding failed: " + data.status);
      }
    } catch (error) {
      console.log("Error fetching geocode data: " + error.message);
    } finally{
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formArea}>
        <Text style={globalStyle.itemHeader}>주소지 등록</Text>
        <View style={styles.formAddress}>
          <TextInput
            label="주소"
            value={address}
            onChangeText={setAddress}
            ref={addressInputRef}
            disabled={true}
            style={[{width: '80%'}, globalStyle.textInput]}
          />
          <Button style={globalStyle.fab} mode="contained" onPress={() => setIsPostVisible(true)}>우편번호 조회</Button>
        </View>
        <Text style={globalStyle.label} >주거유형</Text>
        <RadioButton.Group
          onValueChange={value => setType(value)} // Update state on selection
          value={type} // Current selected value
        >
          <View style={globalStyle.horizontalRadioGroup}>
            <RadioButton.Item label="아파트" value="Apartment" position="leading" style={globalStyle.radioLabel} />
            <RadioButton.Item label="오피스텔" value="Officetel" position="leading" style={globalStyle.radioLabel} />
            <RadioButton.Item label="다세대" value="multiplex" position="leading" style={globalStyle.radioLabel} />
            <RadioButton.Item label="다가구" value="multiFamily" position="leading" style={globalStyle.radioLabel} />
            <RadioButton.Item label="단독주택" value="singleFamily" position="leading" style={globalStyle.radioLabel} />
          </View>
        </RadioButton.Group>
      </View>
      {isPostVisible && popupPostcode()}
      <View style={{flex: 0.5, justifyContent: 'center'}}>
      {!isFormValid ? (
        <Text style={styles.TextValidation}>
          {errors.message}
        </Text>
      ) : null}
      </View>
      <Button
        mode="contained"
        disabled={!isFormValid | !isFinished}
        onPress={() => saveMarker()}
        style={styles.bottomButton}>
          주소지 등록
      </Button>
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
  formArea: {
    width: '100%',
    flex: 1
  },
  formAddress: {
    flexDirection: 'row',
  },
  TextValidation: {
    fontSize:24,
    fontWeight:'bold',
    textAlign:'center',
    paddingBottom:16
  },
  bottomButton: {
    position: 'absolute',
    bottom: 20, // Add padding from the bottom
    alignSelf: 'center', // Center horizontally
    width: '90%', // Optional: full-width button with padding on each side
  },
})

export default RegisterPin;