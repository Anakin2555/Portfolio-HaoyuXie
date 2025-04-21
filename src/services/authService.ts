import { API_URL } from '../api/api';

export interface AdminUser {
  id: string;
  username: string;
  role: 'admin';
  avatar: string;
}

class AuthService {
  private static readonly TOKEN_KEY = 'admin_token';
  private static readonly USER_KEY = 'admin_user';

  static async login(username: string, password: string): Promise<AdminUser> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      this.setToken(data.token);
      this.setUser(data.user);
      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static getUser(): AdminUser | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  private static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private static setUser(user: AdminUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
}

export default AuthService; 