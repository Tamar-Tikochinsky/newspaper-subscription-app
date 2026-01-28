import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { PaymentPage } from './pages/PaymentPage';
import { AdminPage } from './pages/AdminPage';
import './App.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
