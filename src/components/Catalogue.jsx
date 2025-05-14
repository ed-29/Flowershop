import React, { useState } from "react";
import productData from "../images.json";
import packageData from "../packages.json";

const Catalogue = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderInfo, setOrderInfo] = useState({
    receiverName: "",
    address: "",
    quantity: 1,
    note: "",
    screenshot: "",
    link: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    const newOrder = {
      id: Date.now(),
      image: selectedProduct.images[0],
      deliveryDate: new Date().toISOString().split('T')[0],
      receiverName: orderInfo.receiverName,
      note: orderInfo.note,
      screenshot: orderInfo.screenshot,
      link: orderInfo.link,
    };

    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    existingOrders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    alert("Order submitted!");

    setSelectedProduct(null);
    setOrderInfo({
      receiverName: "",
      address: "",
      quantity: 1,
      note: "",
      screenshot: "",
      link: "",
    });
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
                  onClick={() => setSelectedProduct(product)}
                  className="mt-2 bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700"
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="catalogue-container mt-10">
        <h1>Special Offers</h1>
        <div className="cards-container grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {packageData.products.map((product) => (
            <div key={product.id} className="card group">
              <img src={product.images[0]} alt={product.name} className="w-full h-64 object-cover" />
              <div className="product-info p-4">
                <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                <p className="text-md text-pink-600 font-medium">${product.price.toFixed(2)}</p>
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="mt-2 bg-pink-600 text-white px-4 py-1 rounded hover:bg-pink-700"
                >
                  Buy
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
            <form onSubmit={handleSubmitOrder} className="space-y-3">
              <input
                type="text"
                name="receiverName"
                placeholder="Receiver's Name"
                value={orderInfo.receiverName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <input
                type="text"
                name="note"
                placeholder="Note to Receiver"
                value={orderInfo.note}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="url"
                name="link"
                placeholder="Google Maps Link to Delivery Address"
                value={orderInfo.link}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="url"
                name="screenshot"
                placeholder="Link to Payment Receipt Image"
                value={orderInfo.screenshot}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                name="quantity"
                min="1"
                value={orderInfo.quantity}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button
                type="submit"
                className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition"
              >
                Submit Order
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Catalogue;
