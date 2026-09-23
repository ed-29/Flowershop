import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [selected, setSelected] = useState('About');
  const navigate = useNavigate();
  const { getTotalItems, toggleCart } = useCart();
  const { isAuthenticated, logout, hasRole } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      const heroSection = document.querySelector('.hero') || document.querySelector('section');
      const catalogueSection = document.getElementById('Catalogue');
      const specialOffersSection = document.getElementById('SpecialOffers');

      if (specialOffersSection && scrollPosition >= specialOffersSection.offsetTop) {
        setSelected('Our Services');
      } else if (catalogueSection && scrollPosition >= catalogueSection.offsetTop) {
        setSelected('Catalogue');
      } else {
        setSelected('About');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            selected === 'About' ? 'text-white font-semibold' : ''
          }
        >
          Home
        </a>
        <a
          href="#Catalogue"
          onClick={() => setSelected('Catalogue')}
          className={
            selected === 'Catalogue' ? 'text-pink-300 font-semibold' : ''
          }
        >
          Our Bestsellers
        </a>
        <a
          href="#SpecialOffers"
          onClick={() => setSelected('Our Services')}
          className={
            selected === 'Our Services' ? 'text-gray-300 font-semibold' : ''
          }
        >
          Special Offers
        </a>
      </div>

      <div className="user flex items-center">
        {isAuthenticated ? (
          <>
            {hasRole('employee') && (
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 text-white px-4 py-2 rounded mr-2 hover:bg-blue-700"
              >
                Dashboard
              </button>
            )}
            {isAuthenticated && !hasRole(['admin', 'employee']) && (
            <button
              onClick={toggleCart}
              className="bg-pink-800 rounded-e-2xl p-2 relative mr-2"
              title="View Cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13l-2 9m5-9v9m6-9v9m4-13H5.4" />
              </svg>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={logout}
              className="bg-black text-white px-4 py-2 rounded hover:bg-neutral-800"
              title="Logout"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-pink-800 px-4 py-2 rounded hover:bg-gray-100"
            >
              Login
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
