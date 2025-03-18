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
import { verifyTokens } from '../utils/tokenUtils';
import globalStyle from "../styles/globalStyle";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

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
    const loadGooglePlaces = () => {
      const input = autocompleteRef.current;
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.setFields(['geometry', 'name']);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          const location = place.geometry.location;
          setCenter({
            latitude: location.lat(),
            longitude: location.lng(),
          });
        }
      });
    };

    if (!window.google || !window.google.maps.places) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = loadGooglePlaces;
      document.body.appendChild(script);
    } else {
      loadGooglePlaces();
    }

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

  const searchFirstSuggestion = async () => {
    const input = autocompleteRef.current.value.trim();
    if (window.google && window.google.maps.places) {
      try {
        const service = new google.maps.places.AutocompleteService();
        const predictions = await new Promise((resolve, reject) => {
          service.getPlacePredictions({ input }, (res, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && res.length > 0) {
              resolve(res);
            } else {
              reject('No suggestions found or autocomplete service failed.');
            }
          });
        });
  
        // Get details of the first suggestion
        const firstPrediction = predictions[0];
        if (firstPrediction) {
          const placesService = new google.maps.places.PlacesService(document.createElement('div'));
          
          // Fetch place details using the `place_id`
          const placeDetails = await new Promise((resolve, reject) => {
            placesService.getDetails({ placeId: firstPrediction.place_id }, (res, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                resolve(res);
              } else {
                reject('Place details fetch failed.');
              }
            });
          });
  
          const location = placeDetails.geometry?.location;
          if (location) {
            setCenter({
              latitude: location.lat(),
              longitude: location.lng(),
            });
          }
        }
      } catch (error) {
        console.error('Error fetching first suggestion:', error);
        alert('No valid locations found for the entered text.');
      }
    } else {
      console.error('Google Maps Places library is not available.');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission or default behavior
      searchFirstSuggestion(); // Call the search function
    }
  };

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
    <View style={{ flex: 1 }}>
      <input
        ref={autocompleteRef}
        type="text"
        placeholder="장소, 주소 검색"
        onKeyDown={handleKeyPress}
        style={{
          padding: '10px',
          width: '100%',
          border: '1px solid #ccc',
          borderRadius: '4px',
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
  );
};

export default Map;
