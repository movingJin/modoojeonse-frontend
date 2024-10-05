/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component, useState, useEffect} from 'react';
import {Pressable, View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Modal, Image} from 'react-native';
import {Node} from 'react';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polygon} from "react-native-maps";
import { FlashList } from "@shopify/flash-list";
import ReviewDetail from './ReviewDetail';

class Map extends Component{
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
      points: [
        {key: 1, address: "서울시 영등포구 신길로 15나길 11 (글로리홈)", latitude: 37.4973234106675, longitude: 126.905182497904, lastEditTime: "2024-03-19"},
        {key: 2, address: "서울시 영등포구 신길로 15나길 12 (temp)", latitude: 37.4974318381051, longitude: 126.905340228462, lastEditTime: "2000-01-01"},
        {key: 3, address: "서울시 종로구 종로33길 15 (연강빌딩)", latitude: 37.571812327, longitude: 127.001000105, lastEditTime: "2000-01-01"}
      ],
      selectedReview: null,
      isReviewListVisible: false,
      isDetailVisible: false
    };
  }

  async componentDidMount(){
    // const [latitude, setLatitude] = useState(null);
    // const [longitude, setLogitude] = useState(null);
    const granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );
    if (granted) {

    } 
    else {
      console.log( "ACCESS_FINE_LOCATION permission denied" );
    }
  }

  pressMarkerCallout = (key) =>{
    console.log(key);
    this.toggleModal();
  }

  toggleModal = () => {
    this.setState({
      isReviewListVisible: !this.state.isReviewListVisible
    });
  };

  selectReview = (review) => {
    this.setState({selectedReview: review});
    this.setState({isDetailVisible: true});
  };

  render() {
    return (
      <View style={style.root}>
        <MapView
          style={{ flex: 1 }}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
          latitude: 37.57002,
          longitude: 126.97962,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
          }}
        >
          {this.state.points.map(point => (
            <Marker
              key={point.key}
              coordinate={{latitude: point.latitude, longitude: point.longitude}}
              title={point.address}
              description={point.lastEditTime}
              onCalloutPress={() => this.pressMarkerCallout(point.address)}
            />
          ))}
        </MapView>
        {this.state.isReviewListVisible && this.popupReviewList()}
        {this.state.isDetailVisible && this.popupDetail()}
      </View>
    );
  }

  popupReviewList=()=>{
    return(
      <Modal
      visible={this.state.isReviewListVisible}
      transparent={true}
      animationType='slide'
      onRequestClose={() => this.toggleModal()}
      >
        <TouchableOpacity style={style.modelStyle} onPress={() => this.setState({isReviewListVisible: false})}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={style.modelWrapperStyle}>
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
    )
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
      animationType='slide'
      onRequestClose={() => this.setState({isDetailVisible: !this.state.isDetailVisible})}>
        <ReviewDetail review={this.state.selectedReview}>
  
        </ReviewDetail>
      </Modal>
    )
  };
}

const style= StyleSheet.create({
  root:{flex:1},
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
  modelStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modelWrapperStyle: {
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

export default Map;
