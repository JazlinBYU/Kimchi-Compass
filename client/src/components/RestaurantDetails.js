import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { UserContext } from "../UserContext"; // Ensure this path is correct
import { Link } from "react-router-dom";

const RestaurantDetails = () => {
  const { currentUser, updateUser } = useContext(UserContext);
  const [newReviewContent, setNewReviewContent] = useState("");
  const [newReviewRating, setNewReviewRating] = useState("");
  const { id } = useParams();
  const [editingReview, setEditingReview] = useState(null); // For tracking the review being edited
  const [restaurant, setRestaurant] = useState({
    name: "",
    image_url: "",
    rating: "",
    phone_number: "",
    address: "",
    reviews: [],
    favorited_by: [],
    food_users: [],
  });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = () => {
    fetch(`/restaurants/${id}`)
      .then((resp) => resp.json())
      .then((restaurantObj) => {
        setRestaurant(restaurantObj);
      })
      .catch((error) => {
        enqueueSnackbar(`Error: ${error.message}`, { variant: "error" });
      });
  };

  const handleSaveFavorite = () => {
    if (!currentUser) {
      enqueueSnackbar("You must be logged in to add a favorite.", {
        variant: "warning",
      });
      return;
    }

    fetch(`/favorites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurant_id: id }),
    })
      .then((response) => response.json())
      .then(() => {
        fetchRestaurantDetails(); // Refetch restaurant details
        enqueueSnackbar("Favorite added successfully!", { variant: "success" });
      })
      .catch((error) => {
        console.error("Error saving favorite", error);
        enqueueSnackbar(error.message, { variant: "error" });
      });
  };

  const handleDeleteFavorite = () => {
    // Assuming favoriteId is available or retrieved somehow
    fetch(`/favorites/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        fetchRestaurantDetails(); // Refetch restaurant details
        enqueueSnackbar("Favorite removed successfully!", {
          variant: "success",
        });
      })
      .catch((error) => {
        enqueueSnackbar(error.message, { variant: "error" });
      });
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setNewReviewContent(review.content);
    setNewReviewRating(review.rating);
  };

  const handleDeleteReview = (reviewId) => {
    fetch(`/reviews/${reviewId}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete review");
        fetchRestaurantDetails(); // Refetch restaurant details
        enqueueSnackbar("Review deleted successfully!", {
          variant: "success",
        });
      })
      .catch((error) => {
        enqueueSnackbar(error.message, { variant: "error" });
      });
  };

  const handleAddOrEditReview = (event) => {
    event.preventDefault();
    if (!currentUser) {
      enqueueSnackbar("You must be logged in to add or edit a review.", {
        variant: "error",
      });
      return;
    }

    const reviewData = {
      content: newReviewContent,
      rating: parseFloat(newReviewRating),
      restaurant_id: id,
      food_user_id: currentUser.id,
    };

    const method = editingReview ? "PATCH" : "POST";
    const endpoint = editingReview
      ? `/reviews/${editingReview.id}`
      : "/reviews";

    fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    })
      .then((response) => response.json())
      .then((updatedOrAddedReview) => {
        fetchRestaurantDetails(); // Refetch restaurant details
        enqueueSnackbar(
          editingReview
            ? "Review updated successfully!"
            : "Review added successfully!",
          { variant: "success" }
        );
        setNewReviewContent("");
        setNewReviewRating("");
        setEditingReview(null);
      })
      .catch((error) => {
        enqueueSnackbar(error.message, { variant: "error" });
      });
  };

  const reviewList = restaurant.reviews.map((review, index) => (
    <li key={index}>
      {review.content} - {review.rating} stars
      {currentUser && currentUser.id === review.food_user_id && (
        <>
          <button onClick={() => handleEditReview(review)}>Edit</button>
          <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
        </>
      )}
    </li>
  ));

  const favoriteUserList = restaurant.favorited_by.map((username, index) => (
    <li key={index}>{username}</li>
  ));

  return (
    <div className="one_restaurant">
      <h2>{restaurant.name}</h2>
      <img src={restaurant.image_url} alt={restaurant.name} />
      <div className="container">
        <main className="restaurant_details">
          <p>Rating: {restaurant.rating}</p>
          <p>Phone Number: {restaurant.phone_number}</p>
          <Link to={`/view-menu/${id}`}>View Menu</Link>
          <ul>{reviewList}</ul>
          <form onSubmit={handleAddOrEditReview}>
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
            <button type="submit">
              {editingReview ? "Update Review" : "Submit Review"}
            </button>
          </form>
          {restaurant.favorited_by.includes(currentUser?.username) ? (
            <button onClick={() => handleDeleteFavorite()}>
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
