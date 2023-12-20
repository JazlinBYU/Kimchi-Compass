import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import AlertBar from "./components/AlertBar";

const CheckSession = () => {
  const [message, setMessage] = useState(null);
  const [snackType, setSnackType] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/check_session")
      .then((resp) => {
        if (resp.ok) {
          resp.json().then(setUser);
        } else {
          resp.json().then((errorObj) => {
            handleSnackType("error");
            setAlertMessage(errorObj.message);
          });
        }
      })
      .catch((errorObj) => {
        handleSnackType("error");
        setAlertMessage(errorObj.message);
      });
  }, []);

  const updateUser = (user) => {
    setUser(user);
  };

  const setAlertMessage = (msg) => setMessage(msg);

  const handleSnackType = (type) => setSnackType(type);

  const ctx = {
    user,
    setAlertMessage,
    handleSnackType,
    updateUser,
  };

  return (
    <div>
      <Header
        user={user}
        updateUser={updateUser}
        setAlertMessage={setAlertMessage}
        handleSnackType={handleSnackType}
      />
      {message && (
        <AlertBar
          message={message}
          snackType={snackType}
          setAlertMessage={setAlertMessage}
          handleSnackType={handleSnackType}
        />
      )}
      <div id="outlet">
        <Outlet context={ctx} />
      </div>
    </div>
  );
};

export default CheckSession;
