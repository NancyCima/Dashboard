import api from './api';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    username: string;
  };
}

class AuthService {
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user';

  login = async (credentials: LoginCredentials): Promise<boolean> => {
    // Por ahora, implementamos una autenticación simple
    if (credentials.username === 'admin' && credentials.password === 'asap1234') {
      const mockResponse: LoginResponse = {
        token: 'mock-jwt-token',
        user: {
          username: credentials.username
        }
      };
      
      localStorage.setItem(this.AUTH_TOKEN_KEY, mockResponse.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(mockResponse.user));
      
      // Configurar el token para futuras peticiones
      api.defaults.headers.common['Authorization'] = `Bearer ${mockResponse.token}`;
      
      return true;
    }
    return false;
  };

  logout = (): void => {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    delete api.defaults.headers.common['Authorization'];
  };

  isAuthenticated = (): boolean => {
    return !!localStorage.getItem(this.AUTH_TOKEN_KEY);
  };

  getToken = (): string | null => {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  };

  getUser = (): { username: string } | null => {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  };
}

export default new AuthService();
