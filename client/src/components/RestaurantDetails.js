import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/restaurants/${id}`); // Adjust the API endpoint as necessary
        if (!response.ok) {
          throw new Error("Something went wrong!"); // Handling response errors
        }
        const data = await response.json();
        setRestaurant(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  if (isLoading) {
    return <p>Loading...</p>; // Or any loading spinner
  }

  if (error) {
    return <p>Error: {error}</p>; // Display error message
  }

  return (
    <div>
      {restaurant ? (
        <div>
          <h2>{restaurant.name}</h2>
          {/* More restaurant details here */}
        </div>
      ) : (
        <p>Restaurant not found.</p>
      )}
    </div>
  );
};

export default RestaurantDetails;
