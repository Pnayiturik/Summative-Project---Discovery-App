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
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const login = async (data: LoginData) => {
  // Remove any undefined or empty fields
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined && value !== '')
  );
  const response = await api.post('/auth/login', cleanData);
  return response.data;
};