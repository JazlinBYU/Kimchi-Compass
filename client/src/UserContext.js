// UserContext.js
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext({
  currentUser: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Replace with your endpoint or local storage key
    const token = localStorage.getItem("token");
    if (token) {
      // Here you would typically have an endpoint to validate the token and fetch user data
      // For now, we'll assume the token is valid and skip that step
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem("token", token); // Store the JWT token in local storage
    setCurrentUser(user); // Update state with the user data
  };

  const logout = () => {
    localStorage.removeItem("token"); // Remove the JWT token from local storage
    setCurrentUser(null); // Update state to reflect that the user is logged out
  };

  return (
    <UserContext.Provider value={{ currentUser, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
