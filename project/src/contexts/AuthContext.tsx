import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from '../api/axios'; // Axios instance with baseURL
import { User, Student, Recruiter } from '../types';
import axios from 'axios';              // for isAxiosError
import api from '../api/axios';
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: Partial<Student | Recruiter>) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('jobPortalUser');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;

      // Save to localStorage and headers
      localStorage.setItem('jobPortalUser', JSON.stringify(user));
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);

      return { success: true };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
    return {
      success: false,
      message: err.response?.data?.message || 'Login failed',
    };
  } else {
    return {
      success: false,
      message: 'Login failed due to unexpected error',
    };
  }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    userData: Partial<Student | Recruiter>
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', userData);
      const { token, user } = res.data;

      // Save to localStorage and headers
      localStorage.setItem('jobPortalUser', JSON.stringify(user));
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);

      return { success: true };
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
    return {
      success: false,
      message: err.response?.data?.message || 'Login failed',
    };
  } else {
    return {
      success: false,
      message: 'Login failed due to unexpected error',
    };
  }

    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jobPortalUser');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
