import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Dashboard } from '@/pages/Dashboard/Dashboard';
import IvaBook from '@/pages/Sales/IvaBook';
import IvaBookDetail from '@/pages/Sales/IvaBookDetail';
import Retenciones from '@/pages/Retentions/Retenciones';
import Percepciones from '@/pages/Perceptions/Percepciones';
import { Login } from '@/pages/Login/Login';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="ventas">
                <Route path="libro-iva" element={<IvaBook />} />
                <Route path="libro-iva-detalle" element={<IvaBookDetail />} />
                <Route path="retenciones" element={<Retenciones />} />
                <Route path="percepciones" element={<Percepciones />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
