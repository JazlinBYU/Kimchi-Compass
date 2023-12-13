import React from "react";

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="restaurant-card">
      {restaurant.image_url && (
        <img src={restaurant.image_url} alt={restaurant.name} />
      )}
      <h3>{restaurant.name}</h3>
      {restaurant.rating && <p>Rating: {restaurant.rating} / 5</p>}
      {restaurant.phone_number && <p>Phone: {restaurant.phone_number}</p>}
      {restaurant.address && <p>Address: {restaurant.address}</p>}
    </div>
  );
};

export default RestaurantCard;
