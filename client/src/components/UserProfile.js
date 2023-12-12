import React, { useContext } from "react";
import { UserContext } from "./UserContext";

const UserProfile = () => {
  const { currentUser, isLoading } = useContext(UserContext);

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      {currentUser ? (
        <div>
          <h1>{currentUser.username}</h1>
          <p>Email: {currentUser.email}</p>
          {/* Display other user profile details */}
        </div>
      ) : (
        <p>User profile not found.</p>
      )}
    </div>
  );
};

export default UserProfile;
