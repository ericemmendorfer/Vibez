import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Set a default user for testing
  const [user, setUser] = useState({
    id: '1',
    name: 'Test User',
    username: 'testuser'
  });
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setUser({ id: '1', username });
    return true;
  };

  const register = async (userData) => {
    setUser({ id: '1', username: userData.username });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 