/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component, createRef, useEffect} from 'react';
import {Pressable, View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Modal, Image} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import MapView, { Region, Marker, PROVIDER_GOOGLE} from "react-native-maps";
import MapViewComponent from './MapViewComponent'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { FAB } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import ReviewList from './ReviewList';
import RegisterPin from './RegisterPin'
import authStore from '../utils/authStore';
import globalStyle from "../styles/globalStyle"
import axios from "axios";
import Config from "react-native-config";

const URL = Config.API_SERVER_URL;

class Map extends Component{
  constructor(props){
    super(props);
    this.mapRef = createRef(); // Ref for MapView
    this.state={
      points: [],
      center: {
        latitude: 37.57002,
        longitude: 126.97962,
        latitudeDelta: 0.0922,  // Default zoom
        longitudeDelta: 0.0421,
      },
      selectedMarker: null,
      isAuthenticated: false,
      isReviewListVisible: false,
      isRegisterVisible: false,
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

  selectMarker = (marker) => {
    this.setState({selectedMarker: marker});
    this.toggleReviewList(true);
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
              <ReviewList toggleReviewList={this.toggleReviewList} selectedMarker={this.state.selectedMarker} />
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
        <Toast />
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

  handlePlaceSelect = (data, details) => {
    // Update region and marker with selected place details
    const { lat, lng } = details.geometry.location;

    const newRegion = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: this.state.center.latitudeDelta,
      longitudeDelta: this.state.center.longitudeDelta
    };

    console.log(lat, lng);
    this.mapRef.current.animateToRegion(newRegion, 1000);
  };

  render() {
    return (
      <View style={{ flex:1 }}>
        <GooglePlacesAutocomplete
          placeholder="장소, 주소 검색"
          fetchDetails={true}
          onPress={this.handlePlaceSelect}
          onFail={(error) => console.log(error)}
          onNotFound={() => console.log("no results")}
          minLength={2}
          query={{
            key: Config.REACT_APP_GOOGLE_MAP_API,
            language: "ko",
            components: "country:kr",
          }}
          debounce={300}
          styles={{
            container: {
              flex: 0,
              position: "absolute",
              width: "100%",
              zIndex: 1,
            },
            listView: { backgroundColor: "white" },
          }}
        />


        <MapViewComponent
          mapRef={(ref) => (this.mapRef.current = ref)} // Bind ref directly
          style={{ flex: 1 }}
          provider={PROVIDER_GOOGLE}
          initialRegion={this.state.center}
          region={this.state.center}
          onRegionChangeComplete={this.onRegionChangeComplete}
        >
          {this.state.points.map(point => (
            <Marker
              key={point.id}
              coordinate={{latitude: point.location.lat, longitude: point.location.lon}}
              title={point.address}
              description={point.timestamp}
              onCalloutPress={() => this.selectMarker(point)}
            />
          ))}
        </MapViewComponent>
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
