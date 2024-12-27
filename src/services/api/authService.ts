import api from './index';
import { User } from '@/types/auth';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

class AuthService {
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user';

  async login(credentials: LoginCredentials): Promise<boolean> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      localStorage.setItem(this.AUTH_TOKEN_KEY, response.data.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.user));
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      return true;
    } catch (error) {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    delete api.defaults.headers.common['Authorization'];
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  getUser(): User | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }
}

export default new AuthService();