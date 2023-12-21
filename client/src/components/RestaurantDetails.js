import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { UserContext } from "../UserContext"; // Ensure this path is correct

const RestaurantDetails = () => {
  const { user } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState({});
  const [hasFavorited, setHasFavorited] = useState(false);
  const {
    name,
    image_url,
    rating,
    phone_number,
    address,
    reviews,
    favorites,
    food_users,
    food_user, // Assuming this is an array of users who have favorited the restaurant
  } = restaurant;

  useEffect(() => {
    fetch(`/restaurants/${id}`)
      .then((resp) => resp.json())
      .then((restaurantObj) => {
        setRestaurant(restaurantObj);
      })
      .catch((error) => {
        enqueueSnackbar(`Error: ${error.message}`, { variant: "error" });
      });
  }, [id, enqueueSnackbar, user]);

  useEffect(() => {
    if (user && restaurant.food_users) {
      check_user_favs();
    }
  }, [user, food_users]);

  const check_user_favs = () => {
    const user_has_favs = food_users?.find(
      (food_user) => food_user["username"] === user.username
    );
    if (user_has_favs) {
      return setHasFavorited(true);
    }
  };

  const handleSaveFavorite = () => {
    // if (!user) {
    //   enqueueSnackbar("You must be logged in to add a favorite.", {
    //     variant: "warning",
    //   });
    //   return;
    // }

    // Proceed with your fetch request since `user` is defined
    fetch(`/favorites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId: id, food_userId: user }),
    })
      .then(() => {
        setHasFavorited(true);
        enqueueSnackbar("Favorite added successfully!", { variant: "success" });
      })
      .catch((error) => {
        console.error("Error saving favorite", error);
        enqueueSnackbar(error.message, { variant: "error" });
      });
  };

  const handleDeleteFavorite = () => {
    const favoriteId = fetch(`/favorites/${favoriteId}`, {
      method: "DELETE",
      headers: {},
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to remove favorite");
        return response.json();
      })
      .then(() => {
        setHasFavorited(false);
        enqueueSnackbar("Favorite removed successfully!", {
          variant: "success",
        });
      })
      .catch((error) => {
        enqueueSnackbar(error.message, { variant: "error" });
      });
  };

  const reviewList = reviews?.map((review) => (
    <li key={review.id}>
      {review.content} - {review.rating} stars
    </li>
  ));

  const favoriteUserList = restaurant.favorited_by?.map((username, index) => (
    <li key={index}>{username}</li>
  ));

  return (
    <div className="one_restaurant">
      <h2>{name}</h2>
      <img src={image_url} alt={name} />

      <div className="container">
        <main className="restaurant_details">
          <p>Rating: {rating}</p>
          <p>Phone Number: {phone_number}</p>
          <ul>{reviewList}</ul>
          {hasFavorited ? (
            <button onClick={() => handleDeleteFavorite(restaurant.id)}>
              Remove Favorite
            </button>
          ) : (
            <button onClick={handleSaveFavorite}>Add to Favorites</button>
          )}
        </main>
        <aside>
          <h3>Users who favorited this restaurant:</h3>
          <ul>{favoriteUserList}</ul>
        </aside>
      </div>
    </div>
  );
};

export default RestaurantDetails;
