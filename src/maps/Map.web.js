// Map.web.js
import React, { useEffect, useState } from 'react';
import {View, TouchableOpacity, TouchableWithoutFeedback, Modal} from 'react-native';
import ReviewList from './ReviewList';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import RegisterPin from './RegisterPin'
import { FAB } from 'react-native-paper';
import axios from "axios";
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
  const [points, setPoints] = useState([
    {
      id: 1,
      address: "서울시 종로구 종로33길 15 (연강빌딩)",
      location: { lat: 37.571812327, lon: 127.001000105 },
      timestamp: "2000-01-01"
    }
  ]);
  const [isReviewListVisible, setReviewListVisible] = useState(false);
  const [isRegisterVisible, setRegisterVisible] = useState(false);

  useEffect(() => {
    const pivot = {"location.lat": 37.4974318381051, "location.lon": 126.905340228462};
    axios.get(`${URL}/geo/distance`, { params: pivot }).then((response) => {
      setPoints(response.data);
    });
  }, []);

  const toggleReviewList = (_isReviewListVisible) => {
    setReviewListVisible(_isReviewListVisible);
  };

  const toggleRegister = (_isRegisterVisible) => {
    setRegisterVisible(_isRegisterVisible);
  };

  popupList=()=>{
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
              <ReviewList toggleReviewList={toggleReviewList} />
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    )
  };

  popupRegisterPin=()=>{
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

  return (
    <View style={{ flex: 1 }}>
      <MapContainer center={[37.57002, 126.97962]} zoom={13} style={{ height: '80vh', width: '100%' }}>
        <MapRefresher />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {points.map(point => (
          <Marker key={point.id} position={[point.location.lat, point.location.lon]}>
            <Popup>
              <div>
                <p>{point.address}<br /> {point.timestamp}</p>
                <button onClick={toggleReviewList} style={{ padding: '5px', cursor: 'pointer' }}>
                  리뷰 보기
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        <FAB
          icon={(props) => <MaterialIcons name="add" size={24} color={props.color} />}
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
