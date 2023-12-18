import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useOutletContext } from "react-router-dom";

const RestaurantDetails = () => {
  const { user } = useOutletContext() || {};
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
    food_users, // Assuming this is an array of users who have favorited the restaurant
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
  }, [id, enqueueSnackbar]);

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
    if (!user) {
      enqueueSnackbar("You must be logged in to add a favorite.", {
        variant: "warning",
      });
      return;
    }

    fetch(`/api/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Include other headers as needed, like authorization tokens
      },
      body: JSON.stringify({ restaurantId: id, userId: user.id }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to save favorite");
        return response.json();
      })
      .then(() => {
        setHasFavorited(true);
        enqueueSnackbar("Favorite added successfully!", { variant: "success" });
        // Additional state updates as needed
      })
      .catch((error) => {
        enqueueSnackbar(error.message, { variant: "error" });
      });
  };

  const handleDeleteFavorite = () => {
    // You need to know the ID of the favorite to delete it
    // This ID should be stored in your state or could be determined some other way
    const favoriteId =
      /* The ID of the user's favorite to delete */

      fetch(`/api/favorites/${favoriteId}`, {
        method: "DELETE",
        headers: {
          // Include headers as needed
        },
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
          // Additional state updates as needed
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
    <div className="restaurant_details">
      <h2>{name}</h2>
      <img src={image_url} alt={name} />

      <div className="container">
        <main className="details">
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
