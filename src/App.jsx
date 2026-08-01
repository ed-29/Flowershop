import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Catalogue from './components/Catalogue';
import OurServices from './components/About';
import Orders from './components/Orders';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import { CartProvider } from './contexts/CartContext';
import { useCart } from './contexts/CartContext';

function AppContent() {
  const location = useLocation();
  const { isOpen } = useCart();
  const isOrdersPage = location.pathname === '/orders';
  const isCheckoutPage = location.pathname === '/checkout';

  return (
    <>
      {!isOrdersPage && !isCheckoutPage && !isOpen && <Header />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <OurServices />
              <Catalogue />
            </>
          }
        />
        <Route path="/orders" element={<Orders />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
      {!isCheckoutPage && <Footer/>}
      {location.pathname === '/' && <Cart />}
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
