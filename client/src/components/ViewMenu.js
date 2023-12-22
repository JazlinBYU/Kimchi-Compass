// ViewMenu.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewMenu = () => {
  const { id } = useParams(); // Restaurant ID from URL
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/menus?restaurant_id=${id}`) // Fetch menus for the specific restaurant
      .then((response) => response.json())
      .then((data) => {
        setMenus(data); // Assuming the backend sends the filtered menus
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching menus:", error);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <div>Loading menus...</div>;
  }

  return (
    <div>
      <h2>Menu</h2>
      {menus.map((menu) => (
        <div key={menu.id}>
          <h3>{menu.name}</h3>
          <ul>
            {menu.menu_dishes.map((menuDish) => (
              <li key={menuDish.id}>
                <strong>{menuDish.dish.name}</strong> -{" "}
                {menuDish.dish.description} - ${menuDish.dish.price}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ViewMenu;
