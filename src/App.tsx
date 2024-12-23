import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { Dashboard } from '@/pages/Dashboard/Dashboard';
import IvaBook from '@/pages/Sales/IvaBook';
import IvaBookDetail from '@/pages/Sales/IvaBookDetail';
import Retenciones from '@/pages/Retentions/Retenciones';
import Percepciones from '@/pages/Perceptions/Percepciones';
import PercepcionesArba from '@/pages/Perceptions/PercepcionesArba';
import PercepcionesAgip from '@/pages/Perceptions/PercepcionesAgip';
import PercepcionesArbaVs from './pages/Reports/PercepcionesArbaVs';
import PercepcionesAgipVs from './pages/Reports/PercepcionesAgipVs';
import IvaVentasDetailVs from './pages/Reports/IvaVentasDetailVs';
import IvaComprasDetailVs from './pages/Reports/IvaComprasDetailVs';
import RetencionesVentasVs from './pages/Reports/RetencionesVentasVs';
import ConsultaUnificadaVs from './pages/Reports/ConsultaUnificadaVs';
import PosicionesIVA from './pages/Positions/PosicionesIVA';
import PosicionesIIBB from './pages/Positions/PosicionesIIBB';
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
                <Route path="percepciones-arba" element={<PercepcionesArba />} />
                <Route path="percepciones-agip" element={<PercepcionesAgip />} />
              </Route>
              <Route path="reportes">
                <Route path="percepciones-arba" element={<PercepcionesArbaVs />} />
                <Route path="percepciones-agip" element={<PercepcionesAgipVs />} />
                <Route path="subdiario-iva-ventas" element={<IvaVentasDetailVs />} />
                <Route path="subdiario-iva-compras" element={<IvaComprasDetailVs />} />
                <Route path="retenciones-venta" element={<RetencionesVentasVs />} />
                <Route path="consulta-unificada" element={<ConsultaUnificadaVs />} />
              </Route>
              <Route path="posiciones">
                <Route path="iva" element={<PosicionesIVA />} />
                <Route path="iibb" element={<PosicionesIIBB />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;