import React, { useState } from "react";
import "../index.css";
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useCatalog, productKey } from '../contexts/CatalogContext';
import { useNavigate } from 'react-router-dom';

const Catalogue = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();
  const { hasRole } = useAuth();
  const { bestsellers, specialOffers, setAvailability, removeProduct } = useCatalog();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const isEmployee = hasRole('employee');

  const handleAddToCart = (product, qty = 1) => {
    if (product.available === false) return;
    const result = addToCart(product, qty);
    if (!result || !result.success) {
      alert(result && result.message ? result.message : 'Please login');
      navigate('/login');
      return;
    }

    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg z-50';
    successMessage.textContent = 'Added to cart!';
    document.body.appendChild(successMessage);

    setTimeout(() => {
      if (successMessage.parentNode) {
        document.body.removeChild(successMessage);
      }
    }, 2000);
  };

  const renderCard = (product) => {
    const unavailable = product.available === false;
    return (
      <div
        key={productKey(product)}
        className="card group"
        onClick={() => {
          setQuantity(1);
          setSelectedProduct(product);
        }}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-64 object-cover ${unavailable ? 'opacity-50' : ''}`}
        />
        {unavailable && (
          <span className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded z-10">
            Unavailable
          </span>
        )}
        <div className="product-info p-4">
          <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
          <p className="text-md text-pink-600 font-medium">${product.price.toFixed(2)}</p>
          {isEmployee ? (
            <div className="mt-2 space-y-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAvailability(product, unavailable);
                }}
                className="w-full bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700"
              >
                {unavailable ? 'Put back on sale' : 'Mark unavailable'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeProduct(product);
                }}
                className="w-full bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product);
              }}
              disabled={unavailable}
              className="mt-2 bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {unavailable ? 'Unavailable' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <section id="Catalogue">
      <div className="catalogue-container">
        <h1>Our Bestsellers</h1>
        <div className="cards-container grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {bestsellers.map(renderCard)}
        </div>
      </div>

      <div id="SpecialOffers" className="catalogue-container mt-10">
        <h1>Special Offers</h1>
        <div className="cards-container grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {specialOffers.map(renderCard)}
        </div>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-2 right-3 text-gray-500 text-xl"
            >
              ×
            </button>
            <img
              src={selectedProduct.images[0]}
              alt={selectedProduct.name}
              className={`w-full h-64 object-cover rounded ${selectedProduct.available === false ? 'opacity-50' : ''}`}
            />
            <h2 className="text-2xl font-bold mt-4">{selectedProduct.name}</h2>
            <p className="text-pink-600 font-medium mb-4">${selectedProduct.price.toFixed(2)}</p>

            {isEmployee ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const nextAvailable = selectedProduct.available === false;
                    const updated = setAvailability(selectedProduct, nextAvailable);
                    if (updated) {
                      setSelectedProduct((current) => current ? { ...current, available: nextAvailable } : current);
                    }
                  }}
                  className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition"
                >
                  {selectedProduct.available === false ? 'Put back on sale' : 'Mark unavailable'}
                </button>
                <button
                  onClick={() => {
                    const removed = removeProduct(selectedProduct);
                    if (removed) setSelectedProduct(null);
                  }}
                  className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Quantity:</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full border hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full border hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(selectedProduct, quantity)}
                  disabled={selectedProduct.available === false}
                  className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedProduct.available === false ? 'Unavailable' : 'Add to Cart'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Catalogue;
