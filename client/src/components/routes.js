import App from "./App";
import Home from "./pages/Home";
import RestaurantDetail from "./pages/RestaurantDetail";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        index: true,
        element: <Home />, // Home page will include a list of restaurants
      },
      {
        path: "/restaurants/:id",
        element: <RestaurantDetail />, // Shows single restaurant, menu, reviews, and favorite option
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/profile/edit",
        element: <EditProfile />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
];

export default routes;
