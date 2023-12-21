// UserContext.js
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext({
  currentUser: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );

  useEffect(() => {
    // On app load, check if user data is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const updateUser = (newUser) => {
    setCurrentUser(newUser);
    localStorage.setItem("currentUser", JSON.stringify(newUser)); // Save user to local storage
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser"); // Clear user from local storage
  };

  const login = (token, user) => {
    localStorage.setItem("token", token); // Store the JWT token in local storage
    setCurrentUser(user); // Update state with the user data
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
