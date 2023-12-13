import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import RestaurantCard from "./RestaurantCard";
import SearchFilter from "./SearchFilter";
import { debounce } from "lodash"; // Ensure lodash is installed

const Home = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/restaurants"); // Adjust the API endpoint as necessary
        if (!response.ok) {
          throw new Error("Failed to fetch restaurants");
        }
        const data = await response.json();
        setRestaurants(data);
        setFilteredRestaurants(data); // Initialize filteredRestaurants
      } catch (error) {
        enqueueSnackbar(`Error: ${error.message}`, { variant: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, [enqueueSnackbar]);

  useEffect(() => {
    const debouncedSearch = debounce(() => {
      const filtered = restaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    }, 300);

    if (searchTerm) {
      debouncedSearch();
    } else {
      setFilteredRestaurants(restaurants);
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, restaurants]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
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
