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
import ReviewList from './ReviewList';
import ReviewDetail from './ReviewDetail';

class Map extends Component{
  constructor(props){
    super(props);
    this.state={
      points: [
        //{key: 1, address: "서울시 영등포구 신길로 15나길 11 (글로리홈)", latitude: 37.4973234106675, longitude: 126.905182497904, lastEditTime: "2024-03-19"},
        //{key: 2, address: "서울시 영등포구 신길로 15나길 12 (temp)", latitude: 37.4974318381051, longitude: 126.905340228462, lastEditTime: "2000-01-01"},
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

  toggleReviewList = (_isReviewListVisible) => {
    this.setState({
      isReviewListVisible: _isReviewListVisible
    });
  };

  toggleReviewDetail = (_isDetailVisible) => {
    this.setState({isDetailVisible: _isDetailVisible});
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
              onCalloutPress={() => this.toggleReviewList(!this.state.isReviewListVisible)}
            />
          ))}
        </MapView>
        {this.state.isReviewListVisible && <ReviewList toggleReviewList={this.toggleReviewList} />}
      </View>
    );
  }
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
