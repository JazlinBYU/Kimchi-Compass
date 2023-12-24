import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import { UserContext } from "../UserContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const RestaurantDetails = () => {
  const { currentUser } = useContext(UserContext);
  const { id } = useParams();
  const [editingReview, setEditingReview] = useState(null);
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
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = () => {
    fetch(`/restaurants/${id}`)
      .then((resp) => resp.json())
      .then((restaurantObj) => {
        setRestaurant(restaurantObj);
        const userReview = restaurantObj.reviews.find(
          (review) => review.food_user_id === currentUser?.id
        );
        setEditingReview(userReview || null);
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
        fetchRestaurantDetails();
        enqueueSnackbar("Favorite added successfully!", { variant: "success" });
      })
      .catch((error) => {
        enqueueSnackbar(error.message, { variant: "error" });
      });
  };

  const handleDeleteFavorite = () => {
    fetch(`/favorites/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        fetchRestaurantDetails();
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
    setShowReviewForm(true);
  };

  const handleDeleteReview = (reviewId) => {
    fetch(`/reviews/${reviewId}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete review");
        setEditingReview(null);
        setShowReviewForm(false);
        fetchRestaurantDetails();
        enqueueSnackbar("Review deleted successfully!", {
          variant: "success",
        });
      })
      .catch((error) => {
        enqueueSnackbar(error.message, { variant: "error" });
      });
  };

  const reviewSchema = Yup.object().shape({
    content: Yup.string().required("Content is required"),
    rating: Yup.number().min(0).max(5).required("Rating is required"),
  });

  const handleAddOrEditReview = (values, { setSubmitting }) => {
    if (!currentUser) {
      enqueueSnackbar("You must be logged in to add or edit a review.", {
        variant: "error",
      });
      return;
    }

    if (
      !editingReview &&
      restaurant.reviews.some(
        (review) => review.food_user_id === currentUser.id
      )
    ) {
      enqueueSnackbar(
        "You have already submitted a review for this restaurant.",
        { variant: "error" }
      );
      return;
    }

    const reviewData = {
      ...values,
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
      .then(() => {
        fetchRestaurantDetails();
        enqueueSnackbar(
          editingReview
            ? "Review updated successfully!"
            : "Review added successfully!",
          { variant: "success" }
        );
        setEditingReview(null);
      })
      .catch((error) => {
        enqueueSnackbar(error.message, { variant: "error" });
      })
      .finally(() => setSubmitting(false));
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

  const userHasReviewed = restaurant.reviews.some(
    (review) => review.food_user_id === currentUser?.id
  );

  const isFavorite = restaurant.favorited_by.includes(currentUser?.username);

  const toggleReviewForm = (review) => {
    setShowReviewForm(!showReviewForm);
    setEditingReview(review);
  };

  return (
    <div className="one_restaurant">
      <h2>{restaurant.name}</h2>
      <img src={restaurant.image_url} alt={restaurant.name} />
      <div className="container">
        <main className="restaurant_details">
          <p>Rating: {restaurant.rating}</p>
          <p>Phone Number: {restaurant.phone_number}</p>
          <Link to={`/view-menu/${id}`}>View Menu</Link>
          {restaurant.reviews.map((review, index) => (
            <div key={index}>
              {review.content} - {review.rating} stars
              {currentUser && currentUser.id === review.food_user_id && (
                <>
                  <button onClick={() => handleEditReview(review)}>Edit</button>
                  <button onClick={() => handleDeleteReview(review.id)}>
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
          {currentUser && (
            <>
              {isFavorite && !showReviewForm && (
                <button onClick={handleDeleteFavorite}>Remove Favorite</button>
              )}
              {!userHasReviewed && !showReviewForm && (
                <button onClick={() => setShowReviewForm(true)}>
                  Review Restaurant
                </button>
              )}
              {userHasReviewed && !showReviewForm && (
                <button onClick={() => setShowReviewForm(true)}>
                  Edit Review
                </button>
              )}
            </>
          )}
          {showReviewForm && (
            <Formik
              initialValues={{
                content: editingReview?.content || "",
                rating: editingReview?.rating || "",
              }}
              validationSchema={reviewSchema}
              onSubmit={(values, actions) => {
                handleAddOrEditReview(values, actions);
                setShowReviewForm(false); // Hide the form after submission
              }}
              enableReinitialize>
              {({ isSubmitting }) => (
                <Form>
                  <Field
                    name="content"
                    as="textarea"
                    placeholder="Write your review here"
                  />
                  <ErrorMessage name="content" component="div" />
                  <Field
                    name="rating"
                    type="number"
                    placeholder="Rating (0-5)"
                    min="0"
                    max="5"
                  />
                  <ErrorMessage name="rating" component="div" />
                  <button type="submit" disabled={isSubmitting}>
                    {editingReview ? "Update Review" : "Submit Review"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}>
                    Cancel
                  </button>
                </Form>
              )}
            </Formik>
          )}
        </main>
        <aside>
          <h3>Users who favorited this restaurant:</h3>
          <ul>
            {restaurant.favorited_by.map((username, index) => (
              <li key={index}>{username}</li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default RestaurantDetails;
