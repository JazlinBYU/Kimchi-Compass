import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { UserContext } from "../UserContext"; // Ensure this path is correct
import { Link } from "react-router-dom";

const RestaurantDetails = () => {
  const { user } = useContext(UserContext);
  const [newReviewContent, setNewReviewContent] = useState("");
  const [newReviewRating, setNewReviewRating] = useState("");
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(""); //useState({});
  const [newFavorited, setHasFavorited] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const {
    name,
    image_url,
    rating,
    phone_number,
    address,
    reviews,
    favorites,
    food_users,
    // Assuming this is an array of users who have favorited the restaurant
  } = restaurant;

  const check_user_favs = () => {
    const user_has_favs = food_users?.find(
      (food_user) => food_user["username"] === user.username
    );
    if (user_has_favs) {
      return setHasFavorited(true);
    }
  };

  useEffect(() => {
    fetch(`/restaurants/${id}`)
      .then((resp) => resp.json())
      .then((restaurantObj) => {
        setRestaurant(restaurantObj);
      })
      .catch((error) => {
        enqueueSnackbar(`Error: ${error.message}`, { variant: "error" });
      });
  }, [id, enqueueSnackbar, food_users]);

  useEffect(() => {
    if (user && restaurant.food_users) {
      check_user_favs();
    }
  }, [user, food_users]);

  const handleSaveFavorite = () => {
    if (!user) {
      enqueueSnackbar("You must be logged in to add a favorite.", {
        variant: "warning",
      });
      return;
    }

    // Proceed with your fetch request since `user` is defined
    fetch(`/favorites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurant_id: id }),
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

  const handleAddReview = (event) => {
    event.preventDefault();
    if (!user) {
      enqueueSnackbar("You must be logged in to add a review.", {
        variant: "error",
      });
      return;
    }

    const reviewData = {
      content: newReviewContent,
      rating: newReviewRating,
      restaurant_id: id,
      food_user_id: user.id, // Assuming 'user' state has user ID
    };

    fetch("/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to add review");
      })
      .then((addedReview) => {
        enqueueSnackbar("Review added successfully!", { variant: "success" });
        // Update local state to show new review, or you could re-fetch the restaurant details
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
          <Link to={`/view-menu/${id}`}>View Menu</Link>{" "}
          {/* Adjust the path as needed */}
          <ul>{reviewList}</ul>
          <form onSubmit={handleAddReview}>
            <textarea
              value={newReviewContent}
              onChange={(e) => setNewReviewContent(e.target.value)}
              placeholder="Write your review here"
            />
            <input
              type="number"
              value={newReviewRating}
              onChange={(e) => setNewReviewRating(e.target.value)}
              placeholder="Rating (0-5)"
              min="0"
              max="5"
            />
            <button type="submit">Submit Review</button>
          </form>
          {newFavorited ? (
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
