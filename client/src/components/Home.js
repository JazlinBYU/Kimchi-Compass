import React, { useState, useEffect } from "react";
import RestaurantCard from "./RestaurantCard";
import SearchFilter from "./SearchFilter";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [alertMessage, setAlertMessage] = useState(""); // Local state for alert messages
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/restaurants");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (
          response.headers.get("content-type")?.includes("application/json")
        ) {
          const data = await response.json();
          setRestaurants(data);
          setFilteredRestaurants(data);
        } else {
          throw new Error("Response not JSON");
        }
      } catch (error) {
        setAlertMessage(error.message); // Update alert message state
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    setFilteredRestaurants(
      restaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, restaurants]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      {alertMessage && <p className="alert">{alertMessage}</p>}{" "}
      {/* Display alert messages */}
      <SearchFilter value={searchTerm} onChange={handleSearchChange} />
      <div className="restaurant-list">
        {isLoading ? (
          <p>Loading restaurants...</p>
        ) : filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))
        ) : (
          <p>No restaurants found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
