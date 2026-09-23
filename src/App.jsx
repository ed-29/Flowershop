import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Catalogue from './components/Catalogue';
import OurServices from './components/About';
import Orders from './components/Orders';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import { Routes, Route, Navigate } from 'react-router-dom';
import Footer from './components/Footer';
import { CartProvider } from './contexts/CartContext';
import { useCart } from './contexts/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CatalogProvider } from './contexts/CatalogContext';

const ProtectedDashboard = () => {
  const { isAuthenticated, hasRole, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Login />;
  }

  if (hasRole('admin')) {
    return <Navigate to="/admin" replace />;
  }

  if (!hasRole('employee')) {
    return <Navigate to="/" replace />;
  }
  
  return <EmployeeDashboard />;
};

const ProtectedAdmin = () => {
  const { isAuthenticated, hasRole, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!isAuthenticated || !hasRole('admin')) return <Login />;
  return <AdminDashboard />;
};

const ProtectedShop = ({ children }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (isAuthenticated && hasRole('admin')) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

function AppContent() {
  const location = useLocation();
  const { isOpen } = useCart();
  const { isAuthenticated, hasRole } = useAuth();
  const isStaff = hasRole(['admin', 'employee']);
  const isOrdersPage = location.pathname === '/orders';
  const isCheckoutPage = location.pathname === '/checkout';
  const isDashboardPage = location.pathname === '/dashboard';
  const isAdminPage = location.pathname === '/admin';
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isOrdersPage && !isCheckoutPage && !isDashboardPage && !isAdminPage && !isLoginPage && !isOpen && <Header />}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedShop>
              <>
                <Hero />
                <OurServices />
                <Catalogue />
              </>
            </ProtectedShop>
          }
        />
        <Route path="/orders" element={<ProtectedShop><Orders /></ProtectedShop>} />
        <Route path="/checkout" element={<ProtectedShop><Checkout /></ProtectedShop>} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedDashboard />} />
        <Route path="/admin" element={<ProtectedAdmin />} />
        <Route path="/user" element={<Navigate to="/" replace />} />
      </Routes>
      {!isCheckoutPage && !isDashboardPage && !isAdminPage && !isLoginPage && <Footer/>}
      {isAuthenticated && !isStaff && <Cart />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CatalogProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </CatalogProvider>
    </AuthProvider>
  );
}

export default App;
