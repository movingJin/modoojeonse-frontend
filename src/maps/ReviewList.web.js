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
import ReviewDetail from './ReviewDetail';
import RegisterReview from './RegisterReview';
import authStore from '../utils/authStore';
import globalStyle from "../styles/globalStyle"

class ReviewList extends Component{
  constructor(props){
    super(props);
    this.state={
      datas: [
        {id: 1, title: "203호 살았던 사람입니다.", body: "룸컨디션 좋습니다.", address: "서울시 영등포구 신길로 15나길 11 (글로리홈) 203호", isReturnDelayed: false, deposit: 90000000, fromDate: "2019-12-31", toDate: "9999-12-31", contractDate: "2019-12-05", rating: 5, lastEditTime: "2024-03-19", img:'require(그림경로)'},
        {id: 2, title: "test_title", body: "Contests", address: "연강빌딩 705호", isReturnDelayed: false, deposit: 90000000, fromDate: "2021-07-14", toDate: "", contractDate: "2021-07-01", rating: 4, lastEditTime: "2023-11-05", img:'require(그림경로)'},
        {id: 3, title: "test_title", body: "Contests", address: "연강빌딩 705호", isReturnDelayed: false, deposit: 90000000, fromDate: "2021-07-14", toDate: "", contractDate: "2021-07-01", rating: 4, lastEditTime: "2023-11-05", img:'require(그림경로)'},
        {id: 4, title: "test_title", body: "Contests", address: "연강빌딩 705호", isReturnDelayed: false, deposit: 90000000, fromDate: "2021-07-14", toDate: "", contractDate: "2021-07-01", rating: 4, lastEditTime: "2023-11-05", img:'require(그림경로)'},
        {id: 5, title: "test_title", body: "Contests", address: "연강빌딩 705호", isReturnDelayed: false, deposit: 90000000, fromDate: "2021-07-14", toDate: "", contractDate: "2021-07-01", rating: 4, lastEditTime: "2023-11-05", img:'require(그림경로)'},
        {id: 6, title: "test_title", body: "Contests", address: "연강빌딩 705호", isReturnDelayed: false, deposit: 90000000, fromDate: "2021-07-14", toDate: "", contractDate: "2021-07-01", rating: 4, lastEditTime: "2023-11-05", img:'require(그림경로)'},
        {id: 7, title: "test_title", body: "Contests", address: "연강빌딩 705호", isReturnDelayed: false, deposit: 90000000, fromDate: "2021-07-14", toDate: "", contractDate: "2021-07-01", rating: 4, lastEditTime: "2023-11-05", img:'require(그림경로)'},
        {id: 8, title: "test_title", body: "Contests", address: "연강빌딩 705호", isReturnDelayed: false, deposit: 90000000, fromDate: "2021-07-14", toDate: "", contractDate: "2021-07-01", rating: 4, lastEditTime: "2023-11-05", img:'require(그림경로)'},
        {id: 9, title: "test_title", body: "Contests", address: "연강빌딩 705호", isReturnDelayed: false, deposit: 90000000, fromDate: "2021-07-14", toDate: "", contractDate: "2021-07-01", rating: 4, lastEditTime: "2023-11-05", img:'require(그림경로)'},
        {id: 10, title: "test_title", body: "Contests", address: "연강빌딩 705호", isReturnDelayed: false, deposit: 90000000, fromDate: "2021-07-14", toDate: "", contractDate: "2021-07-01", rating: 4, lastEditTime: "2023-11-05", img:'require(그림경로)'},
        {id: 11, title: "test_title", body: "Contests", address: "연강빌딩 705호", isReturnDelayed: false, deposit: 90000000, fromDate: "2021-07-14", toDate: "", contractDate: "2021-07-01", rating: 4, lastEditTime: "2023-11-05", img:'require(그림경로)'}
      ],
      selectedReview: null,
      isReviewListVisible: true,
      isDetailVisible: false,
      isInsertVisible: false,
      isAuthenticated: false
    };
  }

  toggleReviewList = (_isReviewListVisible) => {
    this.setState({isReviewListVisible: _isReviewListVisible});
    this.props.toggleReviewList(_isReviewListVisible);
  };

  toggleReviewDetail = (_isDetailVisible) => {
    this.setState({isDetailVisible: _isDetailVisible});
  };

  toggleInsert = (_isInsertVisible) => {
    this.setState({isInsertVisible: _isInsertVisible});
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
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isInsertVisible !== this.state.isInsertVisible) {

    }
  }

  render() {
    return (
      <View style={globalStyle.flashListWrapper}>
        <Text style={globalStyle.itemHeader}>{this.props.selectedMarker.address}</Text>
        <FlashList
          data={this.state.datas}
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
                <Text style={globalStyle.itemIssueDate}>{item.lastEditTime}</Text>
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
              <ReviewDetail review={this.state.selectedReview} />
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
              <RegisterReview toggleInsert={this.toggleInsert} selectedMarker={this.props.selectedMarker}/>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    )
  };
}

export default ReviewList;
