import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const Header = ({ user, updateUser }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = () => {
    fetch("/logout", { method: "DELETE" })
      .then(() => {
        updateUser(null);
        navigate("/");
        enqueueSnackbar("Logged out successfully", { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar("Logout failed: " + err.message, { variant: "error" });
      });
  };

  return (
    <div id="header">
      <div className="App-header">
        <NavLink to={"/"}>
          <img src="/logo12.png" className="logo" alt="Kimchi-Compass Logo" />
        </NavLink>
        {user ? (
          <div className="container">
            <Link to={`/profile/${user.id}`}>
              <button>Profile</button>
            </Link>
            <Link to="/add-restaurant">
              <button>Add Restaurant</button>
            </Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <Link to={"/register"}>
            <button>Login</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
