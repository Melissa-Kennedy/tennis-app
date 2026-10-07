import React, { useMemo, useState } from 'react';
import { Address } from '../../types/Address';
import { Visit } from '../../types/Passport';
import StarRating from '../StarRating/StarRating';

interface AddressListProps {
  addresses: Address[];
  visits: Record<string, Visit>;
  onAddressClick: (address: Address) => void;
}

type Filter = 'all' | 'visited' | 'todo';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'visited', label: 'Stamped' },
  { value: 'todo', label: 'To visit' },
];

const AddressList: React.FC<AddressListProps> = ({ addresses, visits, onAddressClick }) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const visitedCount = addresses.filter((address) => visits[address.id]).length;
  const percent = Math.round((visitedCount / addresses.length) * 100);

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return addresses.filter((address) => {
      const visited = Boolean(visits[address.id]);
      if (filter === 'visited' && !visited) return false;
      if (filter === 'todo' && visited) return false;
      return !needle || address.name.toLowerCase().includes(needle) || address.address.toLowerCase().includes(needle);
    });
  }, [addresses, visits, query, filter]);

  return (
    <div className="address-list">
      <div className="list-progress">
        <div className="list-progress-numbers">
          <span><strong>{visitedCount}</strong> of {addresses.length} courts stamped</span>
          <span>{percent}%</span>
        </div>
        <div className="progress-track" role="progressbar" aria-valuenow={visitedCount} aria-valuemin={0} aria-valuemax={addresses.length}>
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <input
        className="search-input"
        type="search"
        placeholder="Search courts or neighbourhoods"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search courts"
      />

      <div className="segmented" role="group" aria-label="Filter courts">
        {FILTERS.map(({ value, label }) => (
          <button key={value} className={filter === value ? 'is-active' : ''} aria-pressed={filter === value} onClick={() => setFilter(value)}>
            {label}
          </button>
        ))}
      </div>

      <ul className="address-items">
        {shown.map((address) => {
          const visit = visits[address.id];
          return (
            <li key={address.id}>
              <button className={visit ? 'address-item is-visited' : 'address-item'} onClick={() => onAddressClick(address)}>
                <span className="address-item-text">
                  <span className="address-item-name">{address.name}</span>
                  <span className="address-item-address">{address.address}</span>
                  {visit && visit.rating > 0 && <StarRating value={visit.rating} size="sm" />}
                </span>
                <span className="visit-badge" aria-label={visit ? 'Stamped' : 'Not visited'}>
                  {visit ? '✓' : ''}
                </span>
              </button>
            </li>
          );
        })}
        {shown.length === 0 && <li className="empty-list">No courts match.</li>}
      </ul>
    </div>
  );
};

export default AddressList;
