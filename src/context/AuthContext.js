import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(ApiService.getCurrentUser());

  const login = async (email, password) => {
    const data = await ApiService.login(email, password);
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  };

  const register = async (email, password, displayName) => {
    const data = await ApiService.register(email, password, displayName);
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    if (data.jwt) {
      localStorage.setItem('token', data.jwt);
    }
  };

  const logout = () => {
    ApiService.logout();
    setUser(null);
  };

  useEffect(() => {
    const currentUser = ApiService.getCurrentUser();
    setUser(currentUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
