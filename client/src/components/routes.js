import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../components/Home"; // Adjusted path
import SignUp from "../components/SignUp"; // Adjusted path
import RestaurantDetails from "../components/RestaurantDetails"; // Adjusted path
import UserProfile from "../components/UserProfile"; // Adjusted path
import AddRestaurantForm from "../components/AddRestaurantForm"; // Adjusted path

const AppRoutes = ({ context }) => {
  return (
    <Routes>
      <Route path="/" element={<Home context={context} />} />
      <Route path="/register" element={<SignUp context={context} />} />
      <Route
        path="/restaurants/:id"
        element={<RestaurantDetails context={context} />}
      />
      <Route path="/profile/:id" element={<UserProfile context={context} />} />
      <Route
        path="/add-restaurant"
        element={<AddRestaurantForm context={context} />}
      />
    </Routes>
  );
};

export default AppRoutes;
