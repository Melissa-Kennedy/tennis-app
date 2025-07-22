import React from 'react';
import { Address } from '../../types/Address';

interface AddressListProps {
  addresses: Address[];
  onAddressClick: (address: Address) => void;
}

const AddressList: React.FC<AddressListProps> = ({ addresses, onAddressClick }) => {
  return (
    <div className="address-list">
      <h2>Tennis Courts</h2>
      <div className="address-items">
        {addresses.map((address) => (
          <div 
            key={address.id} 
            className="address-item" 
            onClick={() => onAddressClick(address)}
          >
            <h3>{address.name}</h3>
            <p>{address.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressList;