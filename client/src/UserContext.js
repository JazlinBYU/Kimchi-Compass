// UserContext.js
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user session data from your API or local storage
    const fetchUserSession = async () => {
      const user = localStorage.getItem("userSession");
      setCurrentUser(user ? JSON.parse(user) : null);
      setIsLoading(false);
    };

    fetchUserSession();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
