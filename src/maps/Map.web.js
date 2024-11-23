// Map.web.js
import React, { useEffect, useState, useCallback } from 'react';
import {View, TouchableOpacity, TouchableWithoutFeedback, Modal} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ReviewList from './ReviewList';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import RegisterPin from './RegisterPin'
import { FAB } from 'react-native-paper';
import axios from "axios";
import authStore from '../utils/authStore';
import { verifyTokens } from '../utils/tokenUtils';
import globalStyle from "../styles/globalStyle"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const URL = 'http://192.168.0.3:58083'

// Define custom marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapRefresher = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
};

const Map = () => {
  const [mapKey, setMapKey] = useState(0); // Key to force re-render
  const [points, setPoints] = useState([]);
  const [center, setCenter] = useState({
    latitude: 37.57002,
    longitude: 126.97962,
    latitudeDelta: 0.0922,  // Default zoom
    longitudeDelta: 0.0421,
  },);
  const [selectedMarker, setSelectedMarker] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReviewListVisible, setReviewListVisible] = useState(false);
  const [isRegisterVisible, setRegisterVisible] = useState(false);

  useEffect(()=>{
    const timer = setTimeout(() => {
      verifyTokens(setIsAuthenticated);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  },[])

  useFocusEffect(
    useCallback(() => {
      loadGeoPoints();
      resetAuthState();
      setMapKey((prevKey) => prevKey + 1);
    }, [])
  );

  const resetAuthState = () => {
    const accessToken = authStore.getState().accessToken;
    if (accessToken === null) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }

  const toggleReviewList = (_isReviewListVisible) => {
    setReviewListVisible(_isReviewListVisible);
  };

  const toggleRegister = (_isRegisterVisible) => {
    setRegisterVisible(_isRegisterVisible);
  };

  selectMarker = (marker) => {
    setSelectedMarker(marker);
    toggleReviewList(true);
  };
  
  const loadGeoPoints = () => {
    const pivot = {
      "location.lat": center.latitude,
      "location.lon": center.longitude
    };
    axios.get(`${URL}/geo/distance`, {params: pivot}).then((response)=>{
      setPoints(response.data);
    });
  }

  const popupList=()=>{
    return(
      <Modal
      visible={isReviewListVisible}
      transparent={true}
      animationType='slide'
      onRequestClose={() => toggleReviewList(!isReviewListVisible)}
      >
        <TouchableOpacity style={globalStyle.modalStyle} onPress={() => toggleReviewList(false)}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={globalStyle.modalWrapperStyle}>
              <ReviewList toggleReviewList={toggleReviewList} selectedMarker={selectedMarker} />
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    )
  };

  const popupRegisterPin=()=>{
    return(
      <Modal
      visible={isRegisterVisible}
      transparent={true}
      animationType='slide'
      onRequestClose={() => toggleRegister(!isRegisterVisible)}
      >
        <TouchableOpacity style={globalStyle.modalStyle} onPress={() => toggleRegister(false)}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={globalStyle.modalWrapperStyle}>
              <RegisterPin toggleRegister={toggleRegister}/>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    )
  };

  const onRegionChangeComplete = (newRegion) => {
    setCenter(newRegion);
    loadGeoPoints();
  };

  const RegionChangeHandler = () => {
    const mapEvents = useMapEvents({
      moveend: () => {
        const newCenter = mapEvents.getCenter(); // Get the new center of the map
        onRegionChangeComplete({
          latitude: newCenter.lat,
          longitude: newCenter.lng,
        });
      },
    });
  
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapContainer 
        key={mapKey} // Force re-render by changing the key
        center={[center.latitude, center.longitude]}
        zoom={13}
        style={{ height: '80vh', width: '100%' }}
        >
        <MapRefresher />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <RegionChangeHandler />
        {points.map(point => (
          <Marker key={point.id} position={[point.location.lat, point.location.lon]}>
            <Popup>
              <div>
                <p>{point.address}<br /> {point.timestamp}</p>
                <button onClick={() => selectMarker(point)} style={{ padding: '5px', cursor: 'pointer' }}>
                  리뷰 보기
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        <FAB
          icon={(props) => <MaterialIcons name="add" size={24} color={props.color} />}
          visible={isAuthenticated}
          style={globalStyle.fab}
          onPress={() => toggleRegister(true)}
        />
      </MapContainer>
      {isReviewListVisible && popupList()}
      {isRegisterVisible && popupRegisterPin()}
    </View>
  );
};

export default Map;
