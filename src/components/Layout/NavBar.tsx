import React from 'react';
import { NavLink } from 'react-router-dom';
import { usePassport } from '../../context/PassportContext';
import { courts } from '../../data/courts';

const NavBar: React.FC = () => {
  const { stampedVisits } = usePassport();

  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        <span className="brand-ball" aria-hidden="true" />
        <span>
          Court Passport <small>Toronto</small>
        </span>
      </NavLink>
      <nav className="nav-links" aria-label="Main">
        <NavLink to="/" end>Map</NavLink>
        <NavLink to="/passport">Passport</NavLink>
      </nav>
      <div className="nav-progress" title={`${stampedVisits.length} of ${courts.length} courts stamped`}>
        <strong>{stampedVisits.length}</strong>/{courts.length}
        <span className="nav-progress-label"> stamped</span>
      </div>
    </header>
  );
};

export default NavBar;
