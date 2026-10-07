import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import MapComponent from './components/Map/MapContainer';
import AddressList from './components/AddressList/AddressList';
import CourtPage from './components/CourtPage/CourtPage';
import NavBar from './components/Layout/NavBar';
import PassportPage from './components/Passport/PassportPage';
import { PassportProvider, usePassport } from './context/PassportContext';
import { courts } from './data/courts';
import { Address } from './types/Address';
import './App.css';

function MapPage() {
  const navigate = useNavigate();
  const { visits } = usePassport();

  const handlePinClick = (address: Address) => {
    navigate(`/court/${address.id}`);
  };

  return (
    <main className="map-page">
      <aside className="sidebar">
        <AddressList addresses={courts} visits={visits} onAddressClick={handlePinClick} />
      </aside>
      <div className="map-container">
        <MapComponent addresses={courts} visits={visits} onPinClick={handlePinClick} />
      </div>
    </main>
  );
}

/** Keeps old /info/:id links working */
function LegacyInfoRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/court/${id}`} replace />;
}

function App() {
  return (
    <PassportProvider>
      <Router>
        <div className="App">
          <NavBar />
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/court/:id" element={<CourtPage />} />
            <Route path="/passport" element={<PassportPage />} />
            <Route path="/info/:id" element={<LegacyInfoRedirect />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </PassportProvider>
  );
}

export default App;
