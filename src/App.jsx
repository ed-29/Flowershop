import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Catalogue from './components/Catalogue';
import OurServices from './components/About';
import Orders from './components/Orders';
import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';

function App() {
  const location = useLocation();
  const isOrdersPage = location.pathname === '/orders';

  return (
    <>
      {!isOrdersPage && <Header />}
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
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
