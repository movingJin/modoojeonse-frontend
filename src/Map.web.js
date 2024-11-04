import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Define custom marker icon (required for Leaflet markers to render correctly)
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
    }, 100); // Adjust timeout if needed
  }, [map]);

  return null;
};

const Map = () => {
  const handlePopupClick = () => {
    alert('Popup clicked!');
    // You can also add more complex logic here, like navigation or state updates
  };

  return(
  <MapContainer center={[37.57002, 126.97962]} zoom={13} style={{ height: '80vh', width: '100%' }}>
    <MapRefresher />
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <Marker position={[37.571812327, 127.001000105]}>
      <Popup>
        <div>
          <p>A pretty CSS3 popup.<br /> Easily customizable.</p>
          {/* Add an element with an onClick handler */}
          <button onClick={handlePopupClick} style={{ padding: '5px', cursor: 'pointer' }}>
            Click Me!
          </button>
        </div>
      </Popup>
    </Marker>
  </MapContainer>
)};

export default Map;
