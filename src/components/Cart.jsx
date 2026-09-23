import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart, isOpen, toggleCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = (itemId) => {
    toggleCart();
    if (itemId) {
      navigate('/checkout', { state: { checkoutItemId: itemId } });
    } else {
      navigate('/checkout');
    }
  };

  const handleRemove = (item) => {
    const confirmed = window.confirm(`Remove ${item.name} from your cart?`);
    if (confirmed) {
      removeFromCart(item.id);
    }
  };

  if (!isOpen) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button
            onClick={() => {
              toggleCart();
              navigate('/');
            }}
            className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Cart</h2>
          <button
            onClick={toggleCart}
            className="text-gray-500 text-xl hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-pink-600">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full border hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full border hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <div className="text-right">
                <p className="font-semibold mb-2">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleRemove(item)}
                    className="text-red-500 text-sm border border-red-300 px-3 py-1 rounded hover:bg-red-50"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => handleCheckout(item.id)}
                    className="bg-pink-600 text-white text-sm px-3 py-1 rounded hover:bg-pink-700"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold">Total:</span>
            <span className="text-xl font-bold text-pink-600">
              ${getTotalPrice().toFixed(2)}
            </span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={clearCart}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
            >
              Clear Cart
            </button>
            <button
              onClick={() => handleCheckout()}
              className="flex-1 bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
            >
              Checkout All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
