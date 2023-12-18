import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import RestaurantCard from "./RestaurantCard"; // Adjust import path as needed

const UserProfile = () => {
  const { currentUser, logout } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      // Replace '/users/:id' with your actual endpoint to fetch user data including favorites
      fetch(`/food_users/${currentUser.id}`)
        .then((response) => {
          if (response.ok) {
            response.json().then(setUserInfo);
          } else {
            // Handle errors
          }
        })
        .catch((error) => {
          // Handle network error
        });
    }
  }, [currentUser]);

  const deleteProfile = () => {
    if (!currentUser) {
      return;
    }

    // Replace '/users/:id' with your actual endpoint for user deletion
    fetch(`/food_users/${currentUser.id}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          logout();
          navigate("/");
        } else {
        }
      })
      .catch((error) => {});
  };

  const favoriteRestaurants = userInfo.favorites?.map((favorite) => (
    <RestaurantCard key={favorite.id} {...favorite.restaurant} />
  ));

  return (
    <div>
      {currentUser && (
        <>
          <div className="main">
            <h2>{userInfo.username}'s Profile</h2>
            <p>Username: {userInfo.username}</p>
            <p>Email: {userInfo.email}</p>

            <div className="buttons">
              <Link to="/profile/edit">
                <button>Edit Profile</button>
              </Link>
              <button onClick={deleteProfile}>Delete Profile</button>
            </div>
          </div>
        </>
      )}
      <div className="container">{favoriteRestaurants}</div>
    </div>
  );
};

export default UserProfile;
