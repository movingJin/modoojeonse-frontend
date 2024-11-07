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
import ReviewDetail from './ReviewDetail';

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
      isDetailVisible: false
    };
  }

  toggleReviewList = (_isReviewListVisible) => {
    this.setState({isReviewListVisible: _isReviewListVisible});
    this.props.toggleReviewList(_isReviewListVisible);
  };

  toggleReviewDetail = (_isDetailVisible) => {
    this.setState({isDetailVisible: _isDetailVisible});
  };

  selectReview = (review) => {
    this.setState({selectedReview: review});
    this.toggleReviewDetail(true);
  };

  render() {
    return (
      <View>
        <Modal
        visible={this.state.isReviewListVisible}
        transparent={true}
        animationType='slide'
        onRequestClose={() => this.toggleReviewList(!this.state.isReviewListVisible)}
        >
          <TouchableOpacity style={style.ListModalStyle} onPress={() => this.toggleReviewList(false)}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={style.modalWrapperStyle}>
                <Text style={style.itemHeader}>헤더</Text>
                <Text style={style.itemBody}>바디</Text>
                <FlashList
                  data={this.state.datas}
                  renderItem={this.renderItem}
                  estimatedItemSize={200}
                  />
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
        {this.state.isDetailVisible && this.popupDetail()}
      </View>
    );
  }

  renderItem=({item})=>{
    return(
      <TouchableOpacity style={style.listView} onPress={() => this.selectReview(item)}>
          {/* <Image source={item.img} style={style.listImg}></Image> */}
          <View style={{flexDirection:'column'}}>
              <Text style={style.listHeader}>{item.title}</Text>
              <Text style={style.itemBody}>{item.body}</Text>
              <View style={style.footer}>
                <Text style={style.itemPublisher}>{item.rating}</Text>
                <Text style={style.itemIssueDate}>{item.lastEditTime}</Text>
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
            <View style={style.modalWrapperStyle}>
              <ReviewDetail review={this.state.selectedReview} />
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    )
  };
}

const style= StyleSheet.create({
  titleText:{
    fontSize:24,
    fontWeight:'bold',
    textAlign:'center',
    paddingBottom:16
  },
  listView:{
    flexDirection:'row',
    borderWidth:1,
    borderRadius:4,
    padding:8,
    marginBottom:12
  },
  listImg:{
    width:120,
    height:100,
    resizeMode:'cover',
    marginRight:8
  },
  listHeader:{
    fontSize:18,
    fontWeight:'bold'
  },
  itemBody:{
      fontSize:16
  },
  itemPublisher:{
    fontSize:14,
    marginRight: 8
  },
  itemIssueDate:{
    fontSize:14
  },
  ListModalStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  detailModalStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalWrapperStyle: {
    backgroundColor: '#ffffff',
    padding: 20,
    width: '80%',
    height: '90%'
  },
  itemHeader:{
    fontSize:18,
    fontWeight:'bold',
    textAlign:'center'
  },
  footer: {
    flexDirection:'row',
    textAlign: 'left',
    marginTop: 8
  }
});

export default ReviewList;
