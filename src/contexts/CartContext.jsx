import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload]
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => String(item.id) !== String(action.payload))
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          String(item.id) === String(action.payload.id)
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    case 'SET_CART':
      return {
        ...state,
        items: action.payload || []
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [isOpen, setIsOpen] = React.useState(false);
  const [cartReady, setCartReady] = React.useState(false);
  const { isAuthenticated, user } = useAuth();

  const persistCart = (items) => {
    if (!isAuthenticated || !user?.id) return;
    try {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify({ items }));
    } catch (e) {
      console.error('Failed to persist cart', e);
    }
  };

  // Load saved cart for authenticated user
  useEffect(() => {
    if (isAuthenticated && user && user.id) {
      try {
        const saved = localStorage.getItem(`cart_${user.id}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          dispatch({ type: 'SET_CART', payload: parsed.items || parsed });
        }
      } catch (e) {
        console.error('Failed to load saved cart', e);
      }
      setCartReady(true);
    } else {
      dispatch({ type: 'CLEAR_CART' });
      setCartReady(false);
      setIsOpen(false);
    }
  }, [isAuthenticated, user && user.id]);

  // Persist cart whenever it changes for authenticated users
  useEffect(() => {
    if (!cartReady) return;
    persistCart(state.items);
  }, [state.items, isAuthenticated, user && user.id, cartReady]);

  const addToCart = (product, quantity = 1) => {
    if (!isAuthenticated) {
      return { success: false, message: 'Please login to add items to cart' };
    }
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...product, quantity }
    });
    try {
      (async () => {
        if (user && localStorage.getItem('token')) {
          await fetch('http://localhost:5000/api/users/activity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({ type: 'cart_add', message: `Added ${product.name} x${quantity}`, meta: { productId: product.id, quantity } })
          });
        }
      })();
    } catch (e) { console.error('Failed to record activity', e); }
    return { success: true };
  };

  const removeFromCart = (productId) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: productId
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id: productId, quantity }
      });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  return (
    <CartContext.Provider value={{
      items: state.items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      isOpen,
      toggleCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
