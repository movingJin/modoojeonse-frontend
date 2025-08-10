// Map.web.js
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {View, TouchableOpacity, TouchableWithoutFeedback, Modal} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import ReviewList from './ReviewList';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import RegisterPin from './RegisterPin'
import { FAB } from 'react-native-paper';
import axios from "axios";
import authStore from '../utils/authStore';
import globalStyle from "../styles/globalStyle";
import { verifyTokens } from '../utils/tokenUtils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomAutocomplete from './CustomAutocomplete';
import {APIProvider } from '@vis.gl/react-google-maps';

const URL = process.env.API_SERVER_URL;

// Define custom marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapRefresher = () => {
  const map = useMap();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트되었음을 표시
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (map && isMounted) {
      // DOM이 완전히 렌더링될 때까지 충분히 기다림
      const timer = setTimeout(() => {
        try {
          map.invalidateSize();
        } catch (error) {
          console.error('Map invalidateSize error:', error);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [map, isMounted]);

  return null;
};

const MoveMapFocus = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo([center.latitude, center.longitude], map.getZoom()); // Adjust map zoom to remain unchanged
    }
  }, [center, map]);

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
  const autocompleteRef = useRef(null);
  const lastFetchCenter = useRef(null);

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
    if (lastFetchCenter.current &&
      lastFetchCenter.current.latitude === newRegion.latitude &&
      lastFetchCenter.current.longitude === newRegion.longitude) {
      return; // Skip API call if center hasn't changed
    }
    lastFetchCenter.current = { ...newRegion }; // Update last fetched center

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
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAP_API} version={'beta'}>
    <View style={{ flex: 1 }}>
      <CustomAutocomplete
        onPlaceSelect={(place) => {
          setCenter({
            latitude: place.location.lat(),
            longitude: place.location.lng(),
          });
        }}
      />

      <MapContainer 
        key={mapKey} // Force re-render by changing the key
        center={[center.latitude, center.longitude]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        >
        <MapRefresher />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MoveMapFocus center={center} />
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
    </APIProvider>
  );
};

export default Map;
