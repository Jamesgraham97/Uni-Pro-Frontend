import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(AuthService.getCurrentUser());

  const login = async (email, password) => {
    const data = await AuthService.login(email, password);
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  };

  const register = async (email, password, displayName) => {
    const data = await AuthService.register(email, password, displayName);
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    // Store JWT for immediate use after registration
    if (data.jwt) {
      localStorage.setItem('token', data.jwt);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
