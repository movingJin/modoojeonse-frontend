/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {Pressable, View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Modal, Image} from 'react-native';
import { FlashList } from "@shopify/flash-list";
import {Button} from 'react-native-paper';
import { findReviews } from '../utils/tokenUtils';
import ReviewDetail from './ReviewDetail';
import RegisterReview from './RegisterReview';
import authStore from '../utils/authStore';
import globalStyle from "../styles/globalStyle";
import customAlert from '../utils/customAlert';

class ReviewList extends Component{
  constructor(props){
    super(props);
    this.state={
      reviews: [],
      selectedReview: null,
      isReviewListVisible: true,
      isDetailVisible: false,
      isInsertVisible: false,
      isAuthenticated: false,
      isFormDirty: false,
    };
  }

  setReviews = (_reviews) => {
    this.setState({reviews: _reviews});
  }

  toggleReviewList = (_isReviewListVisible) => {
    this.setState({isReviewListVisible: _isReviewListVisible});
    this.props.toggleReviewList(_isReviewListVisible);
  };

  toggleReviewDetail = (_isDetailVisible) => {
    this.setState({isDetailVisible: _isDetailVisible});
  };

  toggleInsert = (_isInsertVisible) => {
    if (!_isInsertVisible && this.state.isFormDirty) {
      customAlert(
        '경고',
        '작성 중인 내용이 사라집니다. 닫으시겠습니까?',
        [
          {text: '닫기', onPress: () => this.setState({ isInsertVisible: false, isFormDirty: false })},
          {text: '취소', onPress: () => null},
        ],
        { cancelable: true }
      );
    } else {
      this.setState({isInsertVisible: _isInsertVisible});
    }
  };

  selectReview = (review) => {
    this.setState({selectedReview: review});
    this.toggleReviewDetail(true);
  };

  resetAuthState = () => {
    const accessToken = authStore.getState().accessToken;
    if (accessToken === null) {
        this.setState({isAuthenticated: false});
    } else {
        this.setState({isAuthenticated: true});
    }
  }

  componentDidMount(){
    //this.focusListener = this.props.navigation.addListener('focus', this.resetAuthState);
    this.resetAuthState();
    findReviews({address: this.props.selectedMarker.address}, this.setReviews);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isInsertVisible !== this.state.isInsertVisible) {
      if(!this.state.isInsertVisible){
        findReviews({address: this.props.selectedMarker.address}, this.setReviews);
      }
    }
    if (prevState.isDetailVisible !== this.state.isDetailVisible) {
      if(!this.state.isDetailVisible){
        findReviews({address: this.props.selectedMarker.address}, this.setReviews);
      }
    }
  }

  render() {
    return (
      <View style={globalStyle.flashListWrapper}>
        <Text style={globalStyle.itemHeader}>{this.props.selectedMarker.address}</Text>
        <FlashList
          data={this.state.reviews}
          renderItem={this.renderItem}
          estimatedItemSize={200}
          />
        <View style={{alignSelf: 'flex-end', flexDirection: 'row',}}>
          {this.state.isAuthenticated &&
            <Button
              visible={false}
              style={{marginTop: 16}}
              mode="contained"
              onPress={() => this.toggleInsert(true)}>후기 등록</Button>
          }
        </View>
        {this.state.isDetailVisible && this.popupDetail()}
        {this.state.isInsertVisible && this.popupInsert()}
      </View>
    );
  }

  renderItem=({item})=>{
    return(
      <TouchableOpacity style={globalStyle.listView} onPress={() => this.selectReview(item)}>
          {/* <Image source={item.img} style={globalStyle.listImg}></Image> */}
          <View style={{flexDirection:'column'}}>
              <Text style={globalStyle.listHeader}>{item.title}</Text>
              <Text style={globalStyle.itemBody}>{item.body}</Text>
              <View style={globalStyle.footer}>
                <Text style={globalStyle.itemPublisher}>{item.rating}</Text>
                <Text style={globalStyle.itemIssueDate}>{item.timestamp}</Text>
              </View>
          </View>
          
      </TouchableOpacity>
    );
  }

  popupDetail=()=>{
    return(
      <Modal
      visible={this.state.isDetailVisible}
      transparent={true}
      animationType='slide'
      onRequestClose={() => this.toggleReviewDetail(!this.state.isDetailVisible)}>
        <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0)'}} onPress={() => this.toggleReviewDetail(false)}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={globalStyle.modalWrapperStyle}>
              <ReviewDetail toggleReviewDetail={this.toggleReviewDetail} review={this.state.selectedReview} />
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    )
  };

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
              <RegisterReview 
                toggleInsert={this.toggleInsert}
                selectedMarker={this.props.selectedMarker}
                onDirtyChange={(isDirty) => this.setState({ isFormDirty: isDirty })}/>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    )
  };
}

export default ReviewList;
