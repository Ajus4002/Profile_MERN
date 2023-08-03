import React, {useEffect, useState} from "react";
import api from "../api.js";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      fetchUserData();
    } else {
      setFetching(false);
    }
  }, []);

  async function fetchUserData() {
    setFetching(true);
    try {
      const response = await api.get(`/users/profile`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    } finally {
      setFetching(false);
    }
  }

  function login(token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    fetchUserData();
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  }

  function refreshUser() {
    fetchUserData();
  }

  if (fetching) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={{ user, login, logout, refreshUser }}>{children}</AuthContext.Provider>;
}

export const AuthContext = React.createContext();
export default AuthProvider;
