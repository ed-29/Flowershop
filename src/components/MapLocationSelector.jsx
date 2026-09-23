import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-pink.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng });
    }
  });
  return null;
};

const MapLocationSelector = ({ onLocationSelect, initialCoords, readOnly = false }) => {
  const [selectedCoords, setSelectedCoords] = useState(initialCoords || { lat: 11.5941, lng: 37.3874 });

  const handleLocationSelect = (coords) => {
    if (readOnly) return;
    setSelectedCoords(coords);
    onLocationSelect?.(coords);
  };

  return (
    <div className="space-y-2">
      <MapContainer
        center={[selectedCoords.lat, selectedCoords.lng]}
        zoom={13}
        className="w-full h-80 rounded-lg border border-gray-300"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!readOnly && <MapClickHandler onLocationSelect={handleLocationSelect} />}
        {selectedCoords && (
          <Marker
            position={[selectedCoords.lat, selectedCoords.lng]}
            icon={customIcon}
          />
        )}
      </MapContainer>
      {selectedCoords && (
        <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
          <span className="font-medium">{readOnly ? 'Delivery location:' : 'Selected Location:'}</span> {selectedCoords.lat.toFixed(6)}, {selectedCoords.lng.toFixed(6)}
        </div>
      )}
      {!readOnly && (
        <p className="text-xs text-gray-500">Click on the map to select your delivery location</p>
      )}
    </div>
  );
};

export default MapLocationSelector;
