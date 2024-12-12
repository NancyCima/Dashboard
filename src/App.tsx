import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Dashboard } from '@/pages/Dashboard/Dashboard';
import IvaBook from '@/pages/Sales/IvaBook';
import IvaBookDetail from '@/pages/Sales/IvaBookDetail';
import { useAuthStore } from '@/stores/authStore';

function App() {
  const isAuth = useAuthStore((state) => state.user !== null);

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="ventas">
            <Route path="libro-iva" element={<IvaBook />} />
            <Route path="libro-iva-detalle" element={<IvaBookDetail />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
