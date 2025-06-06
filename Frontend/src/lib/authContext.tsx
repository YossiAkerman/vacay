import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSessionExpired = () => {
    toast.error('Dear User, Your session has expired. Please re-login.', {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    
    logout();
    
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await API.post('/users/login', {
        email,
        password,
      });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('name', user.name);
      localStorage.setItem('id', user.id.toString());
      
      setUser({
        id: user.id,
        name: user.name,
        role: user.role
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      const response = await API.post('/users/register', {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('name', user.name);
      localStorage.setItem('id', user.id.toString());
      
      setUser({
        id: user.id,
        name: user.name,
        role: user.role
      });
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('id');
    setUser(null);
    setIsAuthenticated(false);
  };

  const verifyToken = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }

      try {
        const response = await API.get('/users/token-validate');
        
        if (response.data.isValid && response.data.user) {
          const userData = response.data.user;
          setUser({
            id: userData.id,
            name: userData.name,
            role: userData.role
          });
          setIsAuthenticated(true);
          return true;
        } else {
          handleSessionExpired();
          return false;
        }
      } catch (apiError: any) {
        if (apiError.response?.status === 401) {
          handleSessionExpired();
          navigate('/login');
          return false;
        }
        return false;
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      handleSessionExpired();
      navigate('/login');
      return false;
    }
  };

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const checkTokenValidity = async () => {
      if (!isMounted) return;
      
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const isValid = await verifyToken();
          if (!isValid && isMounted) {
            handleSessionExpired();
          }
        } catch (error) {
          console.error("Token validation error:", error);
          if (isMounted) {
            handleSessionExpired();
          }
        }
      } else {
        if (location.pathname !== '/login' && location.pathname !== '/register') {
          navigate('/login');
        }
      }
    };

    checkTokenValidity();
    timeoutId = setInterval(checkTokenValidity, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(timeoutId);
    };
  }, [location.pathname, navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, verifyToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 