/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component, useState, useEffect} from 'react';
import {Pressable, View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Modal, Image} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE} from "react-native-maps";
import { FAB } from 'react-native-paper';
import ReviewList from './ReviewList';
import RegisterPin from './RegisterPin'
import globalStyle from "../styles/globalStyle"
import axios from "axios";

const URL = 'http://192.168.0.3:58083'

class Map extends Component{
  constructor(props){
    super(props);
    this.state={
      points: [
        {id: 1, address: "서울시 종로구 종로33길 15 (연강빌딩)", location: {lat: 37.571812327, lon: 127.001000105}, timestamp: "2000-01-01"}
      ],
      isReviewListVisible: false
    };
  }

  async componentDidMount(){
    const granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );
    if (granted) {

    } 
    else {
      console.log( "ACCESS_FINE_LOCATION permission denied" );
    }

    const pivot = {"location.lat": 37.4974318381051, "location.lon": 126.905340228462}
    axios.get(`${URL}/geo/distance`, {params: pivot}).then((response)=>{
      this.setState({points: response.data});
    });
  }

  toggleReviewList = (_isReviewListVisible) => {
    this.setState({
      isReviewListVisible: _isReviewListVisible
    });
  };

  popupList=()=>{
    return(
      <Modal
      visible={this.state.isReviewListVisible}
      transparent={true}
      animationType='slide'
      onRequestClose={() => this.toggleReviewList(!this.state.isReviewListVisible)}
      >
        <TouchableOpacity style={globalStyle.modalStyle} onPress={() => this.toggleReviewList(false)}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={globalStyle.modalWrapperStyle}>
              <ReviewList toggleReviewList={this.toggleReviewList} />
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    )
  };

  render() {
    return (
      <View style={{ flex:1 }}>
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
              key={point.id}
              coordinate={{latitude: point.location.lat, longitude: point.location.lon}}
              title={point.address}
              description={point.timestamp}
              onCalloutPress={() => this.toggleReviewList(!this.state.isReviewListVisible)}
            />
          ))}
        </MapView>
        {this.state.isReviewListVisible && this.popupList()}
        <FAB
          icon="plus"
          style={globalStyle.fab}
          onPress={() => <RegisterPin />}
        />
      </View>
    );
  }
}

export default Map;
