import { Formik, Field, Form, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import * as Yup from "yup";

const FormComp = () => {
  const outletContext = useOutletContext();
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();

  // Moved the check for 'outletContext' inside useEffect
  useEffect(() => {
    if (outletContext) {
      const { user, setAlertMessage, handleSnackType } = outletContext;

      if (user) {
        fetch(`/food_users/${user.id}`)
          .then((resp) => resp.json())
          .then((data) => {
            setUserInfo(data);
          })
          .catch((err) => {
            handleSnackType("error");
            setAlertMessage(err.message);
          });
      }
    }
  }, [outletContext]);

  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingTimeout(true);
    }, 5000); // Set timeout for 5 seconds

    return () => clearTimeout(timer);
  }, []);

  // Modify the conditional rendering logic
  if (!outletContext || loadingTimeout) {
    return (
      <div>
        {loadingTimeout ? "Loading timeout, please try again." : "Loading..."}
      </div>
    );
  }

  const { user, updateUser, setAlertMessage, handleSnackType } = outletContext;

  const handleSubmit = (values) => {
    const url = user ? `/food_users/${user.id}` : "/food_users";
    const method = user ? "PATCH" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.id) {
          updateUser(data);
          navigate(`/profile/${data.id}`);
        } else {
          handleSnackType("error");
          setAlertMessage(data.message);
        }
      })
      .catch((err) => {
        handleSnackType("error");
        setAlertMessage(err.message);
      });
  };

  return (
    <Formik
      initialValues={{
        username: userInfo.username || "",
        email: userInfo.email || "",
        password: "",
      }}
      validationSchema={Yup.object({
        username: Yup.string()
          .min(3, "Must be at least 3 characters")
          .required("Required"),
        email: Yup.string().email("Invalid email address").required("Required"),
        password: Yup.string()
          .min(8, "Must be at least 8 characters")
          .required("Required"),
      })}
      onSubmit={handleSubmit}>
      <Form>{/* Form fields */}</Form>
    </Formik>
  );
};

export default FormComp;
