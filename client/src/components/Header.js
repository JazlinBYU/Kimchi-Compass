import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { UserContext } from "../UserContext"; // Adjust the import path as needed

const Header = () => {
  const { currentUser, updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = () => {
    // We can use the logout function from the context instead of redefining it
    // Assuming that the logout function from the context already handles navigation and snackbars
    currentUser.logout().catch((err) => {
      enqueueSnackbar("Logout failed: " + err.message, { variant: "error" });
    });
  };

  return (
    <div id="header">
      <NavLink to={"/"}>
        <img src="/logo12.png" className="logo" alt="Kimchi-Compass Logo" />
      </NavLink>
      <nav>
        {currentUser ? (
          <>
            <Link to={`/profile/${currentUser.id}`}>Profile</Link>
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
