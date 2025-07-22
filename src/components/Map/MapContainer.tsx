import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Address } from '../../types/Address';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  addresses: Address[];
  onPinClick: (address: Address) => void;
}

const customIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapComponent: React.FC<MapComponentProps> = ({ addresses, onPinClick }) => {
  const defaultCenter: [number, number] = [43.6532, -79.3832]; // NYC
  
  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {addresses.map((address) => (
        <Marker
          key={address.id}
          position={[address.latitude, address.longitude]}
          icon={customIcon}
          eventHandlers={{
            click: () => onPinClick(address),
          }}
        >
          <Popup>
            <div>
              <h3>{address.name}</h3>
              <p>{address.address}</p>
              <button onClick={() => onPinClick(address)}>
                View Details
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;