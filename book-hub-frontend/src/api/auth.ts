import api from './axios';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const register = async (data: RegisterData) => {
  try {
    const response = await api.post('/auth/register', data);
    console.log('Register response:', response);
    if (response.status >= 400) {
      throw new Error(response.data?.message || 'Registration failed');
    }
    return response.data;
  } catch (error: any) {
    console.error('Register error:', error);
    throw error;
  }
};

export const login = async (data: LoginData) => {
  try {
    const response = await api.post('/auth/login', data);
    console.log('Login response:', response);
    if (response.status >= 400) {
      throw new Error(response.data?.message || 'Login failed');
    }
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  }
};