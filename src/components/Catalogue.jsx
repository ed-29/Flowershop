import React, { useState } from "react";
import "../index.css";
import productData from "../images.json";
import packageData from "../packages.json";
import { useCart } from '../contexts/CartContext';

const Catalogue = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (product, quantity = 1) => {
    addToCart(product, quantity);
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg z-50';
    successMessage.textContent = 'Added to cart!';
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
      document.body.removeChild(successMessage);
    }, 2000);
  };

  return (
    <section id="Catalogue">
      <div className="catalogue-container">
        <h1>Our Bestsellers</h1>
        <div className="cards-container grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productData.products.map((product) => (
            <div key={product.id} className="card group">
              <img src={product.images[0]} alt={product.name} className="w-full h-64 object-cover" />
              <div className="product-info p-4">
                <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                <p className="text-md text-pink-600 font-medium">${product.price.toFixed(2)}</p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-2 bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id="SpecialOffers" className="catalogue-container mt-10">
        <h1>Special Offers</h1>
        <div className="cards-container grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {packageData.products.map((product) => (
            <div key={product.id} className="card group">
              <img src={product.images[0]} alt={product.name} className="w-full h-64 object-cover" />
              <div className="product-info p-4">
                <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                <p className="text-md text-pink-600 font-medium">${product.price.toFixed(2)}</p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-2 bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
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
              className="w-full h-64 object-cover rounded"
            />
            <h2 className="text-2xl font-bold mt-4">{selectedProduct.name}</h2>
            <p className="text-pink-600 font-medium mb-4">${selectedProduct.price.toFixed(2)}</p>
            
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
                onClick={() => handleAddToCart(selectedProduct)}
                className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Catalogue;
