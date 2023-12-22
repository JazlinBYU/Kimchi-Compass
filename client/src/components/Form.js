import { Formik, Field, Form, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import * as Yup from "yup";

const FormComp = () => {
  const { user, updateUser, setAlertMessage, handleSnackType } =
    useOutletContext();
  const [userInfo, setUserInfo] = useState({});

  const navigate = useNavigate();

  const url = user ? `/food_users/${userInfo.id}` : "/food_users";
  const method = user ? "PATCH" : "POST";

  useEffect(() => {
    if (user) {
      fetch(`/food_users/${user.id}`)
        .then((resp) => {
          if (resp.ok) {
            resp.json().then(setUserInfo);
          } else {
            resp.json().then((err) => {
              handleSnackType("error");
              setAlertMessage(err.message);
            });
          }
        })
        .catch((err) => {
          handleSnackType("error");
          setAlertMessage(err.message);
        });
    }
  }, [user]);

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
      onSubmit={(values) => {
        fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...values, ongoing: true }),
        })
          .then((resp) => {
            if (resp.ok) {
              resp
                .json()
                .then((newFood_User) => {
                  updateUser(newFood_User);
                  return newFood_User;
                })
                .then((newFood_User) =>
                  navigate(`/profile/${newFood_User.id}`)
                );
            } else {
              resp.json().then((error) => {
                console.log(url);
                handleSnackType("error");
                setAlertMessage(error.message);
              });
            }
          })
          .catch((error) => {
            handleSnackType("error");
            setAlertMessage(error.message);
          });
      }}>
      <Form>
        <div>
          <label htmlFor="username">Username</label>
          <Field name="username" type="text" className="block" />
          <ErrorMessage name="username" className="block" />

          <label htmlFor="email">Email Address</label>
          <Field name="email" type="email" className="block" />
          <ErrorMessage name="email" className="block" />

          <label htmlFor="password">Password</label>
          <Field name="password" type="password" className="block" />
          <ErrorMessage name="password" className="block" />
        </div>

        <div className="buttons">
          <button type="submit">Submit</button>
        </div>
      </Form>
    </Formik>
  );
};

export default FormComp;
