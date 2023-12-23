import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import AppRoutes from "./components/routes"; // Import the routes file
import { useSnackbar } from "notistack";

const App = () => {
  const [user, setUser] = useState(null);
  const { enqueueSnackbar } = useSnackbar(); // Using notistack for notifications

  // useEffect(() => {
  //   fetch("/check_session")
  //     .then((resp) => {
  //       if (resp.ok) {
  //         resp.json().then((data) => {
  //           console.log(data);
  //           setUser(data);
  //         });
  //       } else {
  //         resp.json().then((errorObj) => {
  //           enqueueSnackbar(errorObj.message, { variant: "error" }); // notistack for displaying error
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       enqueueSnackbar("Error checking session", { variant: "error" }); // notistack for displaying error
  //     });
  // }, []);

  const updateUser = (user) => {
    setUser(user);
  };

  const ctx = { user, updateUser };

  return (
    <div>
      <Header user={user} updateUser={updateUser} />
      <AppRoutes context={ctx} />
    </div>
  );
};

export default App;
