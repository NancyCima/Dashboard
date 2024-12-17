import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const drawerWidth = 240;

interface MenuItem {
  text: string;
  icon: JSX.Element;
  path?: string;
  subItems?: SubMenuItem[];
}

interface SubMenuItem {
  text: string;
  path: string;
}

const menuItems: MenuItem[] = [
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
    text: 'Retenciones',
    icon: <ReceiptIcon />,
    path: '/ventas/retenciones',
  },
  {
    text: 'Percepciones',
    icon: <ReceiptIcon />,
    path: '/ventas/percepciones',
  },
];

const Layout = () => {
  const [open, setOpen] = useState(true);
  const [salesOpen, setSalesOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const theme = useTheme();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.path) {
      navigate(item.path);
    } else if (item.text === 'Libro IVA') {
      setSalesOpen(!salesOpen);
    }
  };

  const handleSubItemClick = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: theme.mode === 'dark' ? "black" : 'white',
          color: theme.mode === 'dark' ? '#FFFFFF' : 'text.primary',
          borderBottom: theme.mode === 'dark' ? '2px solid ##424242' : '2px solid #2461B3',
          boxShadow: 'none',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: (theme) =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: (theme) =>
              theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }),
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit" onClick={theme.toggleTheme}>
              {theme.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <Typography variant="body1">
              {user?.username}
            </Typography>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          ...(open && {
            width: drawerWidth,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              transition: (theme) =>
                theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
            },
          }),
          ...(!open && {
            '& .MuiDrawer-paper': {
              width: '57px',
              transition: (theme) =>
                theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
                }),
            },
          }),
        }}
      >
        <Box sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pb: 2,
          pt: 1,
          px: 2,
          backgroundColor: theme.mode === 'dark' ? '#424242' : 'white',
          position: 'relative'
        }}>
          <Typography
            variant="body2"
            sx={{
              position: 'absolute',
              top: '0px',
              opacity: open ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
              fontWeight: 'bold',
              color: '#bfbfbf',
              zIndex: 1,
              fontSize: '14px',
              backgroundColor: theme.mode === 'dark' ? "#363535" : "#f5f5f5",
              padding: '4px 8px',
              borderRadius: '4px',
              width: '100%',
              textAlign: 'center'
            }}
          >
            FE: 1.1.12v | BE: 1.1.19v
          </Typography>
          <Typography
            variant="body2"
            sx={{
              position: 'absolute',
              top: '132px',
              opacity: open ? 1 : 0,
              transition: 'opacity 0.2s ease-in-out',
              fontWeight: 'bold',
              color: 'text.primary',
              zIndex: 1,
              fontSize: '14px',
              backgroundColor: theme.mode === 'dark' ? "#363535" : "#f5f5f5",
              padding: '4px 8px',
              borderRadius: '4px'
            }}
          >
            Alemar Data Analytics
          </Typography>
          <img
            src={theme.mode === 'dark' ? "/assets/logos/asap_blanco.png" : "/assets/logos/asap_azul.png"}
            alt="ASAP Logo"
            style={{
              width: open ? '80%' : '40px',
              height: 'auto',
              transition: 'width 0.2s ease-in-out'
            }}
          />
        </Box>
        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 1
        }}>
          <IconButton onClick={toggleDrawer} size="small">
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <div key={item.text}>
              <ListItemButton onClick={() => handleMenuItemClick(item)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {item.subItems && (
                  <>
                    {(item.text === 'Libro IVA' && salesOpen) ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </>
                )}
              </ListItemButton>
              {item.subItems && (
                <Collapse
                  in={
                    (item.text === 'Libro IVA' && salesOpen)
                  }
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItemButton
                        key={subItem.text}
                        sx={{ pl: 4 }}
                        onClick={() => handleSubItemClick(subItem.path)}
                      >
                        <ListItemText primary={subItem.text} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </div>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
