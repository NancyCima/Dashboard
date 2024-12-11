import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Paper } from '@mui/material';
import { useAuthStore } from '@/stores/authStore';

export const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(credentials.username);
    navigate('/dashboard');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Distrimar DATA View
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Usuario"
              autoFocus
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Contraseña"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Iniciar Sesión
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
