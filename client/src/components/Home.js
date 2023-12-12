import React, { useState, useEffect } from "react";
import RestaurantCard from "./RestaurantCard";
import SearchFilter from "./SearchFilter";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Example fetch function
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("/api/restaurants"); // Adjust the API endpoint as necessary
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        // Handle error appropriately in your application
      }
    };

    fetchRestaurants();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRestaurants = searchTerm
    ? restaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : restaurants;

  return (
    <div>
      <SearchFilter value={searchTerm} onChange={handleSearchChange} />
      <div className="restaurant-list">
        {filteredRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
};

export default Home;
