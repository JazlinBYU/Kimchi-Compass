import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { UserProvider } from "./UserContext"; // Import UserProvider
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import RestaurantDetails from "./components/RestaurantDetails";
import UserProfile from "./components/UserProfile";
import AddRestaurantForm from "./components/AddRestaurantForm";

function App() {
  return (
    <UserProvider>
      {" "}
      {/* Wrap the application with UserProvider */}
      <Router>
        <div>
          {/* Navigation Bar and other shared components */}

          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/sign-in" component={SignIn} />
            <Route path="/restaurants/:id" component={RestaurantDetails} />
            <Route path="/profile" component={UserProfile} />
            <Route path="/add-restaurant" component={AddRestaurantForm} />
          </Switch>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
