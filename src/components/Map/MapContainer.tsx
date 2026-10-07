import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Address } from '../../types/Address';
import { Visit } from '../../types/Passport';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  addresses: Address[];
  visits: Record<string, Visit>;
  onPinClick: (address: Address) => void;
}

const markerIcon = (color: 'red' | 'green') =>
  new Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const unvisitedIcon = markerIcon('red');
const visitedIcon = markerIcon('green');

const MapComponent: React.FC<MapComponentProps> = ({ addresses, visits, onPinClick }) => {
  const defaultCenter: [number, number] = [43.6532, -79.3832]; // Toronto

  return (
    <MapContainer center={defaultCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {addresses.map((address) => {
        const visited = Boolean(visits[address.id]);
        return (
          <Marker key={address.id} position={[address.latitude, address.longitude]} icon={visited ? visitedIcon : unvisitedIcon}>
            <Popup>
              <div className="map-popup">
                <strong>{address.name}</strong>
                <span>{address.address}</span>
                <span className={visited ? 'popup-status is-visited' : 'popup-status'}>
                  {visited ? '✓ Stamped' : 'Not visited yet'}
                </span>
                <button className="button button-primary button-small" onClick={() => onPinClick(address)}>
                  {visited ? 'View your visit' : 'Stamp this court'}
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;
