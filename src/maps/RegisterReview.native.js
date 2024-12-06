import React, { useState, useRef, useEffect } from 'react';
import { Platform, View, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Modal, StyleSheet, Text, Keyboard } from 'react-native';
import { TextInput, Button, RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import authStore from '../utils/authStore';
import Toast from 'react-native-toast-message';
import { saveReview, editReview } from '../utils/tokenUtils';
import globalStyle from "../styles/globalStyle"

const URL = 'http://192.168.0.3:58083'

const RegisterReview = ({ toggleInsert, selectedMarker, selectedReview }) => {
  const [title, setTitle] = useState(selectedReview ? selectedReview.title: '');
  const [body, setBody] = useState(selectedReview ? selectedReview.body: '');
  const [addressDetail, setAddressDetail] = useState(selectedReview ? selectedReview.addressDetail: '');
  const [contractType, setContractType] = useState(selectedReview ? selectedReview.contractType: 'Monthly');
  const [isReturnDelayed, setIsReturnDelayed] = useState(selectedReview ? selectedReview.isReturnDelayed: false);
  const [deposit, setDeposit] = useState(selectedReview ? selectedReview.deposit: 0);
  const [contractDate, setContractDate] = useState(selectedReview? selectedReview.contractDate.split('T')[0]: '');
  const [fromDate, setFromDate] = useState(selectedReview? selectedReview.fromDate.split('T')[0]: '');
  const [toDate, setToDate] = useState(selectedReview? selectedReview.toDate.split('T')[0]: '');
  const [rating, setRating] = useState(selectedReview ? selectedReview.rating: 1);
  const [lastDate, setLastDate] = useState('');

  const [errors, setErrors] = useState({}); 
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPicker, setShowPicker] = useState({ show: false, field: '' });
  const openPicker = (field) => {
    Keyboard.dismiss();

    if(field === 'contractDate' && contractDate !== ''){
      setLastDate(contractDate);
    }else if(field === 'fromDate' && fromDate !== ''){
      setLastDate(fromDate);
    }else if(field === 'toDate' && toDate !== ''){
      setLastDate(toDate);
    }else{
      setLastDate(new Date().toISOString().split('T')[0]);
    }
    setShowPicker({ show: true, field })
  };

  const isFirstRender = useRef(true);
  const titleInputRef = useRef();
  const bodyInputRef = useRef();
  const addressDetailInputRef = useRef();
  const isReturnDelayedInputRef = useRef();
  const depositInputRef = useRef();
  const contractDateInputRef = useRef();
  const fromDateInputRef = useRef();
  const toDateInputRef = useRef();

  useEffect(() => {
    titleInputRef.current?.focus();
  }, [])

  useEffect(() => { 
    validateForm();
  }, [title, body, addressDetail, contractType, isReturnDelayed, deposit, contractDate, fromDate, toDate, rating]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    if(isFinished & !isLoading){
      toggleInsert(false);
    }
  }, [isFinished, isLoading])

  function validateForm() { 
    const errors = {};
    if (!toDate) { 
      errors.message = '거주종료일은 필수 입력입니다.';
    }
    if (!fromDate) { 
      errors.message = '거주시작일은 필수 입력입니다.';
    }
    if (!contractDate) { 
      errors.message = '계약일은 필수 입력입니다.';
    }
    if (!contractType) { 
      errors.message = '주거유형은 필수 입력입니다.';
    }
    if (!deposit) { 
      errors.message = '보증금은 필수 입력입니다.';
    }
    if (!addressDetail) {
      errors.message = '상세주소는 필수 입력입니다.'; 
    }
    if (!body) { 
      errors.message = '본문은 필수 입력입니다.';
    }
    if (!title) { 
      errors.message = '제목은 필수 입력입니다.';
    }
    
    // Set the errors and update form validity 
    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0); 
  }

  const onDateChange = (event, selectedDate) => {
    setShowPicker({ show: false, field: '' });
    if(event.type === "dismissed"){
      return;
    }

    if(selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      if (showPicker.field === 'contractDate') setContractDate(formattedDate);
      if (showPicker.field === 'fromDate') setFromDate(formattedDate);
      if (showPicker.field === 'toDate') setToDate(formattedDate);
    }
  };

  const save = async () => {
    const payload = {
      title,
      body,
      address: selectedReview? selectedReview.address: selectedMarker.address,
      addressDetail,
      contractType,
      isReturnDelayed,
      deposit,
      contractDate: contractDate+"T00:00:00.000Z",
      fromDate: fromDate+"T00:00:00.000Z",
      toDate: toDate+"T00:00:00.000Z",
      rating,
      author: authStore.getState().email,
      type: contractType
    };
    setIsFinished(false);
    setIsLoading(true);
    if(selectedReview){
      payload.id = selectedReview.id;
      editReview(payload, setIsLoading, setIsFinished);
    }else{
      saveReview(payload, setIsLoading, setIsFinished);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formArea}>
        <Text style={globalStyle.itemHeader}>후기 등록</Text>
        <ScrollView>
        <TextInput
          label="제목"
          value={title}
          mode="outlined"
          onChangeText={setTitle}
          ref={titleInputRef}
          style={globalStyle.textInput}
        />
        <TextInput
          label="본문"
          value={body}
          mode="outlined"
          multiline
          numberOfLines={5}
          onChangeText={setBody}
          ref={bodyInputRef}
          style={globalStyle.textInput}
        />
        <TextInput
          label="주소"
          value={selectedReview ? selectedReview.address: selectedMarker.address}
          disabled={true}
          mode="outlined"
          style={globalStyle.textInput}
        />
        <TextInput
          label="상세 주소"
          value={addressDetail}
          mode="outlined"
          onChangeText={setAddressDetail}
          ref={addressDetailInputRef}
          style={globalStyle.textInput}
        />
        <Text style={globalStyle.label} >계약유형</Text>
        <RadioButton.Group
          onValueChange={(value) => {
            setContractType(value)}}
          value={contractType} 
        >
          <View style={globalStyle.horizontalRadioGroup}>
            <RadioButton.Item label="월세" value="Monthly" position="leading" style={globalStyle.radioLabel} />
            <RadioButton.Item label="전세" value="Jeonse" position="leading" style={globalStyle.radioLabel} />
            <RadioButton.Item label="매매" value="Owning" position="leading" style={globalStyle.radioLabel} />
          </View>
        </RadioButton.Group>
        <TextInput
          label="보증금"
          value={deposit.toString()}
          mode="outlined"
          keyboardType="numeric"
          onChangeText={(text) => {
            const numericValue = text.replace(/[^0-9]/g, '');
            setDeposit(numericValue === '' ? 0 : parseInt(numericValue, 10));
          }}
          ref={depositInputRef}
          right={<TextInput.Affix text="만원" />}
          style={globalStyle.textInput}
        />
        <TextInput
          label="계약일"
          value={contractDate}
          mode="outlined"
          onFocus={() => openPicker('contractDate')}
          style={globalStyle.textInput}
        />
        <TextInput
          label="거주시작일"
          value={fromDate}
          mode="outlined"
          onFocus={() => openPicker('fromDate')}
          style={globalStyle.textInput}
        />
        <TextInput
          label="거주종료일"
          value={toDate}
          mode="outlined"
          onFocus={() => openPicker('toDate')}
          style={globalStyle.textInput}
        />
        <Text style={globalStyle.label} >보증금반환지연</Text>
        <RadioButton.Group
          onValueChange={value => setIsReturnDelayed(value)}
          value={isReturnDelayed} 
        >
          <View style={globalStyle.horizontalRadioGroup}>
            <RadioButton.Item label="예" value={true} position="leading" style={globalStyle.radioLabel} />
            <RadioButton.Item label="아니오" value={false} position="leading" style={globalStyle.radioLabel} />
          </View>
        </RadioButton.Group>
        <Text style={globalStyle.label} >평점</Text>
        <RadioButton.Group
          onValueChange={value => setRating(value)}
          value={rating} 
        >
          <View style={globalStyle.horizontalRadioGroup}>
            <RadioButton.Item label="1" value={1} position="leading" style={globalStyle.radioLabel} />
            <RadioButton.Item label="2" value={2} position="leading" style={globalStyle.radioLabel} />
            <RadioButton.Item label="3" value={3} position="leading" style={globalStyle.radioLabel} />
            <RadioButton.Item label="4" value={4} position="leading" style={globalStyle.radioLabel} />
            <RadioButton.Item label="5" value={5} position="leading" style={globalStyle.radioLabel} />
          </View>
        </RadioButton.Group>
        {showPicker.show && (
          <DateTimePicker
            value={new Date(lastDate)}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            style={{width:200, height:200}}
            onChange={onDateChange}
          />
        )}
        </ScrollView>
      </View>
      <View style={globalStyle.formValidation}>
      {!isFormValid ? (
        <Text style={globalStyle.textValidation}>
          {errors.message}
        </Text>
      ) : null}
      </View>
      <Button
        mode="contained"
        disabled={!isFormValid | isLoading}
        onPress={() => save()}
        style={styles.bottomButton}>
          후기 등록
      </Button>
      <Toast />
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
  bottomButton: {
    position: 'absolute',
    bottom: 20, // Add padding from the bottom
    alignSelf: 'center', // Center horizontally
    width: '90%', // Optional: full-width button with padding on each side
  },
})

export default RegisterReview;