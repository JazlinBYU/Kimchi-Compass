import React from "react";
import { Route, Routes } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { UserProvider } from "./UserContext";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import RestaurantDetails from "./components/RestaurantDetails";
import UserProfile from "./components/UserProfile";
import AddRestaurantForm from "./components/AddRestaurantForm";

function App() {
  return (
    <UserProvider>
      <SnackbarProvider maxSnack={3}>
        {" "}
        {/* Wrap with SnackbarProvider */}
        <div>
          {/* Navigation Bar and other shared components */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/restaurants/:id" element={<RestaurantDetails />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/add-restaurant" element={<AddRestaurantForm />} />
            {/* <Route path="*" element={<ErrorPage />} />{" "} */}
            {/* Handle unmatched routes */}
          </Routes>
        </div>
      </SnackbarProvider>
    </UserProvider>
  );
}

export default App;
