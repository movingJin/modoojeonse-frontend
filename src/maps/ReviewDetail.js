import React, {Component, useState, useEffect} from 'react';
import {Pressable, View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {Button} from 'react-native-paper';
import RegisterReview from './RegisterReview';
import { findReviewById } from '../utils/tokenUtils';
import authStore from '../utils/authStore';
import globalStyle from "../styles/globalStyle"
import { FlashList } from "@shopify/flash-list";

export default class ReviewDetail extends Component {
  constructor(props){
    super(props);
    this.state={
      selectedItem: this.props.review,
      isAuthenticated: false,
      isInsertVisible: false
    };
  }

  resetAuthState = () => {
    const accessToken = authStore.getState().accessToken;
    if (accessToken === null) {
        this.setState({isAuthenticated: false});
    } else {
        this.setState({isAuthenticated: true});
    }
  }

  setReview = (_review) => {
    this.setState({selectedItem: _review});
  }

  toggleInsert = (_isInsertVisible) => {
    this.setState({isInsertVisible: _isInsertVisible});
  };

  componentDidMount(){
    this.resetAuthState();
    findReviewById({id: this.state.selectedItem.id}, this.setReview);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isInsertVisible !== this.state.isInsertVisible) {
      if(!this.state.isInsertVisible){
        findReviewById({id: this.state.selectedItem.id}, this.setReview);
      }
    }
  }
  
  popupInsert=()=>{
    return(
      <Modal
      visible={this.state.isInsertVisible}
      transparent={true}
      animationType='slide'
      onRequestClose={() => this.toggleInsert(!this.state.isInsertVisible)}>
        <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0)'}} onPress={() => this.toggleInsert(false)}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={globalStyle.modalWrapperStyle}>
              <RegisterReview toggleInsert={this.toggleInsert} selectedReview={this.state.selectedItem}/>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    )
  };

  render() {
    return (
      <View style={globalStyle.container}>
        <Text style={globalStyle.titleText}>{this.state.selectedItem.title}</Text>
        <View style={{alignSelf: 'flex-end', flexDirection: 'row',}}>
          {this.state.isAuthenticated &&
            <Button
              visible={false}
              // style={{marginTop: 16}}
              mode="contained"
              onPress={() => this.toggleInsert(true)}>수정</Button>
          }
        </View>
        <Text >주소: {this.state.selectedItem.address}</Text>
        <Text >상세주소: {this.state.selectedItem.addressDetail}</Text>
        <Text>보증금반환지연: {this.state.selectedItem.isReturnDelayed ? "지연됨": "정상"}</Text>
        <Text>보증금: {(this.state.selectedItem.deposit)} (만원)</Text>
        <Text>거주기간: {this.state.selectedItem.fromDate} ~ {this.state.selectedItem.toDate === "9999-12-31" ? "거주중": this.state.selectedItem.toDate}</Text>
        <Text>계약일: {this.state.selectedItem.contractDate}</Text>
        <Text style={globalStyle.rating}>평점: {this.state.selectedItem.rating}</Text>
        <Text style={globalStyle.lastEditTime}>마지막 수정일: {this.state.selectedItem.timestamp}</Text>
        <ScrollView>
          <Text style={globalStyle.body}>{this.state.selectedItem.body}</Text>
        </ScrollView>
        {this.state.isInsertVisible && this.popupInsert()}
      </View>
    );
  }

}