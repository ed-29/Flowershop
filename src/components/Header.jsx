import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [selected, setSelected] = useState('About');
  const navigate = useNavigate();

  return (
    <header>
      <div className="logo">
        <a href="#"><img src="./logo.svg" alt="logo" /></a>
      </div>

      <div className="links">
        <a
          href="#"
          onClick={() => setSelected('About')}
          className={
            selected === 'About' ? 'selected' : ''
          }
        >
          About
        </a>
        <a
          href="#Catalogue"
          onClick={() => setSelected('Catalogue')}
          className={
            selected === 'Catalogue' ? 'selected' : ''
          }
        >
          Catalogue
        </a>
        <a
          href="#OurServices"
          onClick={() => setSelected('Our Services')}
          className={
            selected === 'Our Services' ? 'selected' : ''
          }
        >
          Our Services
        </a>
      </div>

      <div className="user">
        <button
  onClick={() => navigate('/orders')}
  className="bg-orange-100 rounded-e-2xl p-2"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l-2 9m5-9v9m6-9v9m4-13H5.4" />
  </svg>
</button>
      </div>
    </header>
  );
};

export default Header;
