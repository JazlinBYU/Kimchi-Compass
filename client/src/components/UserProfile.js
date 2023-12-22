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
      fetch(`/food_users/${currentUser.id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data); // Log to see the structure
          setUserInfo(data);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [currentUser]);

  const deleteProfile = () => {
    // Confirm with the user before deletion
    if (!window.confirm("Are you sure you want to delete your profile?")) {
      return;
    }

    if (!currentUser) {
      alert("No user is currently logged in.");
      return;
    }

    fetch(`/food_users/${currentUser.id}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          logout();
          navigate("/");
          alert("Your profile has been successfully deleted.");
        } else {
          // Handle non-ok responses
          response.json().then((errorData) => {
            alert(`Failed to delete profile: ${errorData.message}`);
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while trying to delete your profile.");
      });
  };

  const favoriteRestaurants = userInfo.restaurants?.map((restaurant) => (
    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
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
