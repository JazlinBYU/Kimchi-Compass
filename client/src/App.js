import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { UserProvider } from "./UserContext";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import RestaurantDetails from "./components/RestaurantDetails";
import UserProfile from "./components/UserProfile";
import AddRestaurantForm from "./components/AddRestaurantForm";
// import ErrorPage from "./components/ErrorPage"; // Assuming you have an ErrorPage component

function App() {
  return (
    <UserProvider>
      <SnackbarProvider maxSnack={3}>
        <Router>
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
        </Router>
      </SnackbarProvider>
    </UserProvider>
  );
}

export default App;
