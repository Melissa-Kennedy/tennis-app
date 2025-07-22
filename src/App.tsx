import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import MapComponent from './components/Map/MapContainer';
import InfoPage from './components/InfoPage/InfoPage';
import AddressList from './components/AddressList/AddressList';
import { Address } from './types/Address';
import addressesData from './data/addresses.json';
import './App.css';

const addresses: Address[] = addressesData;

function MapPage() {
  const navigate = useNavigate();
  
  const handlePinClick = (address: Address) => {
    navigate(`/info/${address.id}`);
  };
  
  return (
    <div className="map-page">
      <div className="sidebar">
        <AddressList addresses={addresses} onAddressClick={handlePinClick} />
      </div>
      <div className="map-container">
        <MapComponent addresses={addresses} onPinClick={handlePinClick} />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/info/:id" element={<InfoPage addresses={addresses} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
