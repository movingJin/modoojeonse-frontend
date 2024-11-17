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
import MapView, { Region, Marker, PROVIDER_GOOGLE} from "react-native-maps";
import { FAB } from 'react-native-paper';
import ReviewList from './ReviewList';
import RegisterPin from './RegisterPin'
import authStore from '../utils/authStore';
import globalStyle from "../styles/globalStyle"
import axios from "axios";

const URL = 'http://192.168.0.3:58083'

class Map extends Component{
  constructor(props){
    super(props);
    this.state={
      points: [],
      center: {
        latitude: 37.57002,
        longitude: 126.97962,
        latitudeDelta: 0.0922,  // Default zoom
        longitudeDelta: 0.0421,
      },
      isAuthenticated: false,
      isReviewListVisible: false,
      isRegisterVisible: false
    };
  }

  async componentDidMount(){
    this.focusListener = this.props.navigation.addListener('focus', this.resetAuthState);
    const granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );
    if (granted) {

    } 
    else {
      console.log( "ACCESS_FINE_LOCATION permission denied" );
    }

    this.loadGeoPoints();
  }
  
  componentWillUnmount() {
    // Removing the listener to prevent memory leaks
    if (this.focusListener) {
      this.focusListener();
    }
  }

  resetAuthState = () => {
    const accessToken = authStore.getState().accessToken;
    if (accessToken === null) {
        this.setState({isAuthenticated: false});
    } else {
        this.setState({isAuthenticated: true});
    }
  }

  toggleReviewList = (_isReviewListVisible) => {
    this.setState({
      isReviewListVisible: _isReviewListVisible
    });
  };

  toggleRegister = (_isRegisterVisible) => {
    this.setState({
      isRegisterVisible: _isRegisterVisible
    });
  };

  loadGeoPoints = () => {
    const pivot = {
      "location.lat": this.state.center.latitude,
      "location.lon": this.state.center.longitude
    };
    axios.get(`${URL}/geo/distance`, {params: pivot}).then((response)=>{
      this.setState({points: response.data});
    });
  }

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

  popupRegisterPin=()=>{
    return(
      <Modal
      visible={this.state.isRegisterVisible}
      transparent={true}
      animationType='slide'
      onRequestClose={() => this.toggleRegister(!this.state.isRegisterVisible)}
      >
        <TouchableOpacity style={globalStyle.modalStyle} onPress={() => this.toggleRegister(false)}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={globalStyle.modalWrapperStyle}>
              <RegisterPin toggleRegister={this.toggleRegister} />
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    )
  };

  onRegionChangeComplete = (newRegion) => {
    this.setState({ center: newRegion });
    this.loadGeoPoints();
  };

  render() {
    return (
      <View style={{ flex:1 }}>
        <MapView
          style={{ flex: 1 }}
          provider={PROVIDER_GOOGLE}
          initialRegion={this.state.center}
          onRegionChangeComplete={this.onRegionChangeComplete}
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
        {this.state.isRegisterVisible && this.popupRegisterPin()}
        <FAB
          icon="plus"
          visible={this.state.isAuthenticated}
          style={globalStyle.fab}
          onPress={() => this.toggleRegister(true)}
        />
      </View>
    );
  }
}

export default Map;
