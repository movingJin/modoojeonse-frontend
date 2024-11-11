import React, {Component, useState, useEffect} from 'react';
import {Pressable, View, Text, StyleSheet, ScrollView, Modal, Image} from 'react-native';
import globalStyle from "../styles/globalStyle"
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
      <View style={globalStyle.container}>
        <Text style={globalStyle.titleText}>{this.props.review.title}</Text>
        <Text >상세주소: {this.props.review.address}</Text>
        <Text>보증금반환지연: {this.props.review.isReturnDelayed ? "지연됨": "정상"}</Text>
        <Text>보증금: {(this.props.review.deposit/10000)} (만원)</Text>
        <Text>거주기간: {this.props.review.fromDate} ~ {this.props.review.toDate === "9999-12-31" ? "거주중": this.props.review.toDate}</Text>
        <Text>계약일: {this.props.review.contractDate}</Text>
        <Text style={globalStyle.rating}>평점: {this.props.review.rating}</Text>
        <Text style={globalStyle.lastEditTime}>마지막 수정일: {this.props.review.lastEditTime}</Text>
        <ScrollView>
          <Text style={globalStyle.body}>{this.props.review.body}</Text>
        </ScrollView>
      </View>
    );
  }

}