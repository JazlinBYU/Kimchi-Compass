import React, { useState } from "react";
import Header from "./components/Header";
import AppRoutes from "./components/routes"; // Import the routes file

const App = () => {
  const [user, setUser] = useState(null);

  const updateUser = (user) => {
    setUser(user);
  };

  const ctx = { user, updateUser };

  return (
    <div>
      <Header user={user} updateUser={updateUser} />
      <AppRoutes context={ctx} />
    </div>
  );
};

export default App;
