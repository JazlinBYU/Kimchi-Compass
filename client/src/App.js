import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
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
        <Router>
          <div>
            {/* Navigation Bar and other shared components */}

            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/sign-up" component={SignUp} />
              <Route path="/restaurants/:id" component={RestaurantDetails} />
              <Route path="/profile" component={UserProfile} />
              <Route path="/add-restaurant" component={AddRestaurantForm} />
            </Switch>
          </div>
        </Router>
      </SnackbarProvider>
    </UserProvider>
  );
}

export default App;
