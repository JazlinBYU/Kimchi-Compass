import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewMenu = () => {
  const { id } = useParams();
  const [menus, setMenus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/menus/${id}`) // Adjust this endpoint as needed
      .then((response) => response.json())
      .then((data) => {
        setMenus(data.menus); // Extracting menus array from the response
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

  if (!Array.isArray(menus)) {
    return <div>Menu data is not available.</div>;
  }

  return (
    <div>
      <h2>Menu</h2>
      <ul>
        {menus.map((menu) => (
          <li key={menu.id}>{menu.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ViewMenu;
