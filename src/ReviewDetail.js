import React, {Component, useState, useEffect} from 'react';
import {Pressable, View, Text, StyleSheet, TouchableOpacity, Modal, Image} from 'react-native';
import { FlashList } from "@shopify/flash-list";

export default class ReviewDetail extends Component {
  constructor(props){
    super(props);
    this.state={
      selectedItem: null
    };
  }

  toggleModal = (item) => {
    this.setState({
      isModalVisible: !this.state.isModalVisible
    });
    this.setState({selectedItem: item});
  };

  render() {
    return (
      <View style={style.root}>
        <Text style={style.titleText}>{this.props.review.title}</Text>
        <Text >상세주소: {this.props.review.address}</Text>
        <Text>보증금반환지연: {this.props.review.isReturnDelayed ? "지연됨": "정상"}</Text>
        <Text>보증금: {(this.props.review.deposit/10000)} (만원)</Text>
        <Text>거주기간: {this.props.review.fromDate} ~ {this.props.review.toDate === "9999-12-31" ? "거주중": this.props.review.toDate}</Text>
        <Text>계약일: {this.props.review.contractDate}</Text>
        <Text style={style.rating}>평점: {this.props.review.rating}</Text>
        <Text style={style.lastEditTime}>마지막 수정일: {this.props.review.lastEditTime}</Text>
        <Text style={style.body}>{this.props.review.body}</Text>
      </View>
    );
  }

}

const style= StyleSheet.create({
  root:{flex:1, padding:16,},
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
  body:{
      fontSize:16
  },
  rating:{
    fontSize:14,
    marginRight: 8
  },
  lastEditTime:{
    fontSize:14
  },
  modelStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modelWrapperStyle: {
    backgroundColor: '#ffffff',
    padding: 20,
    width: '90%'
  },
  itemHeader:{
    fontSize:18,
    fontWeight:'bold',
    textAlign:'center'
  },
  header: {
    flexDirection:'row',
    textAlign: 'left',
    marginTop: 8
  }
});
