import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export interface MenuItem {
  text: string;
  icon: JSX.Element;
  path?: string;
  subItems?: SubMenuItem[];
}

export interface SubMenuItem {
  text: string;
  path: string;
}

export const menuItems: MenuItem[] = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
  },
  {
    text: 'Libro IVA',
    icon: <ShoppingCartIcon />,
    subItems: [
      { text: 'Libro IVA Gráfico', path: '/ventas/libro-iva' },
      { text: 'Libro IVA Detalle', path: '/ventas/libro-iva-detalle' },
    ],
  },
  {
    text: 'Reportes',
    icon: <AssessmentIcon />,
    subItems: [
      { text: 'Subdiario IVA Ventas', path: '/reportes/subdiario-iva-ventas' },
      { text: 'Subdiario IVA Compras', path: '/reportes/subdiario-iva-compras' },
      { text: 'Percepciones ARBA', path: '/reportes/percepciones-arba' },
      { text: 'Percepciones AGIP', path: '/reportes/percepciones-agip' },
      { text: 'Retenciones de Venta', path: '/reportes/retenciones-venta' },
      { text: 'Consulta Unificada', path: '/reportes/consulta-unificada' },
    ],
  },
  {
    text: 'Retenciones',
    icon: <ReceiptIcon />,
    path: '/ventas/retenciones',
  },
  {
    text: 'Percepciones',
    icon: <ReceiptIcon />,
    subItems: [
      { text: 'Percepciones', path: '/ventas/percepciones' },
      { text: 'Percepciones ARBA', path: '/ventas/percepciones-arba' },
      { text: 'Percepciones AGIP', path: '/ventas/percepciones-agip' },
    ],
  },
  {
    text: 'Posiciones',
    icon: <AccountBalanceIcon />,
    subItems: [
      { text: 'Posiciones IVA', path: '/posiciones/iva' },
      { text: 'Posiciones IIBB', path: '/posiciones/iibb' },
    ],
  }
];