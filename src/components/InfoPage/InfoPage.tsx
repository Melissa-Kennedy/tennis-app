import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Address } from '../../types/Address';

interface InfoPageProps {
  addresses: Address[];
}

const InfoPage: React.FC<InfoPageProps> = ({ addresses }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const address = addresses.find(addr => addr.id === id);
  
  if (!address) {
    return (
      <div className="info-page">
        <h2>Location not found</h2>
        <button onClick={() => navigate('/')}>Back to Map</button>
      </div>
    );
  }
  
  return (
    <div className="info-page">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Map
      </button>
      
      <div className="info-content">
        <h1>{address.name}</h1>
        <div className="info-section">
          <h3>Address</h3>
          <p>{address.address}</p>
        </div>
        
        {address.winterplay && (
          <div className="info-section">
            <h3>Winter Play?</h3>
            <p>{address.winterplay}</p>
          </div>
        )}

        {address.lights && (
          <div className="info-section">
            <h3>Do the courts have lights?</h3>
            <p>{address.lights}</p>
          </div>
        )}

        {address.courts && (
          <div className="info-section">
            <h3>Number of Courts</h3>
            <p>{address.courts}</p>
          </div>
        )}
        

        
     
      
{/*         
        {address.amenities && address.amenities.length > 0 && (
          <div className="info-section">
            <h3>Amenities</h3>
            <ul>
              {address.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default InfoPage;