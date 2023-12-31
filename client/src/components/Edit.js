import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

const EditProfile = () => {
  const { currentUser, updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isUpdated, setIsUpdated] = useState(false);

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters long"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    currentPassword: Yup.string().min(
      3,
      "Current password must be at least 8 characters long"
    ),
    newPassword: Yup.string().min(
      3,
      "New password must be at least 8 characters long"
    ),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("newPassword"), null],
      "Passwords must match"
    ),
  });

  const handleFormSubmit = (values, { setSubmitting }) => {
    if (
      values.currentPassword &&
      values.currentPassword === values.newPassword
    ) {
      enqueueSnackbar(
        "New password must be different from the current password.",
        { variant: "error" }
      );
      setSubmitting(false);
      return;
    }

    const payload = {
      username: values.username,
      email: values.email,
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    };

    // API call
    fetch(`/food_users/${currentUser.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message);
          });
        }
        return response.json();
      })
      .then((UserContext) => {
        updateUser(UserContext);
        setIsUpdated(true); // Set the updated flag
        enqueueSnackbar("Profile updated successfully!", {
          variant: "success",
        });
      })
      .catch((error) => {
        enqueueSnackbar(error.message, { variant: "error" });
      })
      .finally(() => setSubmitting(false));
  };
  useEffect(() => {
    if (isUpdated) {
      navigate(`/profile/${currentUser.id}`);
    }
  }, [isUpdated, currentUser, navigate]);

  console.log(currentUser);

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      <Formik
        initialValues={{
          username: currentUser?.username || "",
          email: currentUser?.email || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize>
        {({ isSubmitting }) => (
          <Form className="edit-profile-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Field name="username" type="text" className="form-control" />
              <ErrorMessage
                name="username"
                component="div"
                className="error-message"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <Field name="email" type="email" className="form-control" />
              <ErrorMessage
                name="email"
                component="div"
                className="error-message"
              />
            </div>

            <div className="form-group">
              <label htmlFor="currentPassword">
                Current Password (leave blank if not changing)
              </label>
              <Field
                name="currentPassword"
                type="password"
                className="form-control"
              />
              <ErrorMessage
                name="currentPassword"
                component="div"
                className="error-message"
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <Field
                name="newPassword"
                type="password"
                className="form-control"
              />
              <ErrorMessage
                name="newPassword"
                component="div"
                className="error-message"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <Field
                name="confirmPassword"
                type="password"
                className="form-control"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="error-message"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary">
              Save Changes
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditProfile;
