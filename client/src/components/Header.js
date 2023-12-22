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
      <NavLink to={"/"}>
        <img src="/logo12.png" className="logo" alt="Kimchi-Compass Logo" />
      </NavLink>
      <nav>
        {user ? (
          <>
            <Link to={`/profile/${user.id}`}>Profile</Link>
            <Link to="/add-restaurant">Add Restaurant</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to={"/register"}>Login</Link>
        )}
      </nav>
    </div>
  );
};

export default Header;
