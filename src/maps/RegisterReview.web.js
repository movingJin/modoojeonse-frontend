import React, { useState, useRef, useEffect } from 'react';
import { Platform, View, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Modal, StyleSheet, Text, Keyboard } from 'react-native';
import { TextInput, Button, RadioButton } from 'react-native-paper';
import authStore from '../utils/authStore';
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
  const [contractDateMask, setContractDateMask] = useState(selectedReview? selectedReview.contractDate.split('T')[0]: '');
  const [fromDate, setFromDate] = useState(selectedReview? selectedReview.fromDate.split('T')[0]: '');
  const [fromDateMask, setFromDateMask] = useState(selectedReview? selectedReview.fromDate.split('T')[0]: '');
  const [toDate, setToDate] = useState(selectedReview? selectedReview.toDate.split('T')[0]: '');
  const [toDateMask, setToDateMask] = useState(selectedReview? selectedReview.toDate.split('T')[0]: '');
  const [rating, setRating] = useState(selectedReview ? selectedReview.rating: 1);
  const [lastDate, setLastDate] = useState('');

  const [errors, setErrors] = useState({}); 
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPicker, setShowPicker] = useState({ show: false, field: '' });
  const openPicker = (field) => {
    setShowPicker({ show: true, field });
  };

  const closePicker = () => {
    setShowPicker({ show: false, field: '' });
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value; // Format: YYYY-MM-DD
    if (showPicker.field === 'contractDate') setContractDate(selectedDate);
    if (showPicker.field === 'fromDate') setFromDate(selectedDate);
    if (showPicker.field === 'toDate') setToDate(selectedDate);
    closePicker();
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

  function onDateChanged(value, setValue, setMask) {
    if(value.replace(/[^0-9]/g, '').length > 8){
      return;
    }
    setValue(value);
    value = value.replace(/[^0-9]/g, '');
    value = value.replace(/^(\d{0,4})(\d{0,2})(\d{0,2})$/g, '$1-$2-$3')
      .replace(/(-{1,2})$/g, '');
    setMask(value);
  };

  function validDate(inputDate) {
    value = inputDate.replace(/[^0-9]/g, '');
    const validformat = /^\d{4}-\d{2}-\d{2}$/;
    if (!validformat.test(inputDate)){
      return false;
    }else {
      const yearfield = inputDate.split("-")[0];
      const monthfield = inputDate.split("-")[1];
      const dayfield = inputDate.split("-")[2];
      const dayobj = new Date(yearfield, monthfield - 1, dayfield);
      if ((dayobj.getMonth() + 1 != monthfield) || (dayobj.getDate() != dayfield) || (dayobj.getFullYear() != yearfield)){
        return false;
      }
    }
    return true;
  }

  function validateForm() {
    const errors = {};
    if (!toDate) { 
      errors.message = '거주종료일은 필수 입력입니다.';
    }else if(!validDate(toDate)){
      errors.message = '날짜 형식이 잘못되었습니다.';
    }
    if (!fromDate) { 
      errors.message = '거주시작일은 필수 입력입니다.';
    }else if(!validDate(fromDate)){
      errors.message = '날짜 형식이 잘못되었습니다.';
    }
    if (!contractDate) { 
      errors.message = '계약일은 필수 입력입니다.';
    }else if(!validDate(contractDate)){
      errors.message = '날짜 형식이 잘못되었습니다.';
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

  const renderDateInput = (label, value, setValue, maskValue, setMask) => (
    <TextInput
      label={label}
      value={maskValue}
      onChangeText={(value) => onDateChanged(value, setValue, setMask)}
      //onFocus={() => openPicker(field)}
      style={globalStyle.textInput}
      placeholder={"YYYY-MM-DD"}
    />
  );

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
      author: selectedReview? selectedReview.author: authStore.getState().email,
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
        {renderDateInput('계약일', contractDate, setContractDate, contractDateMask, setContractDateMask)}
        {renderDateInput('거주시작일', fromDate, setFromDate, fromDateMask, setFromDateMask)}
        {renderDateInput('거주종료일', toDate, setToDate, toDateMask, setToDateMask)}
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