import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { UserContext } from "../UserContext"; // Adjust the path as necessary

const SignUp = () => {
  const { setUser } = useContext(UserContext); // Using UserContext

  // Validation Schema for Sign Up
  const signUpValidationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
    // Additional fields like 'confirmPassword' etc.
  });

  // Validation Schema for Sign In
  const signInValidationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleOAuthSignIn = (provider) => {
    window.location.href = `/api/auth/${provider}`;
  };

  const handleSignUpSubmit = async (values) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        // Assuming the response contains the user data
        const userData = await response.json();
        setUser(userData); // Update user context
        // Redirect or additional logic
      } else {
        // Handle errors
      }
    } catch (error) {
      // Handle network errors
    }
  };

  const handleSignInSubmit = async (values) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        // Assuming the response contains the user data
        const userData = await response.json();
        setUser(userData); // Update user context
        // Redirect or additional logic
      } else {
        // Handle errors
      }
    } catch (error) {
      // Handle network errors
    }
  };

  return (
    <div>
      <div>
        <h2>Sign Up</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={signUpValidationSchema}
          onSubmit={handleSignUpSubmit}>
          {() => (
            <Form>
              <Field type="email" name="email" placeholder="Email" />
              <ErrorMessage name="email" component="div" />
              <Field type="password" name="password" placeholder="Password" />
              <ErrorMessage name="password" component="div" />
              <button type="submit">Sign Up</button>
            </Form>
          )}
        </Formik>
      </div>
      <div>
        <h2>Sign In</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={signInValidationSchema}
          onSubmit={handleSignInSubmit}>
          {() => (
            <Form>
              <Field type="email" name="email" placeholder="Email" />
              <ErrorMessage name="email" component="div" />
              <Field type="password" name="password" placeholder="Password" />
              <ErrorMessage name="password" component="div" />
              <button type="submit">Sign In</button>
            </Form>
          )}
        </Formik>
      </div>
      <h2>Or Sign In with</h2>
      <button onClick={() => handleOAuthSignIn("google")}>Google</button>
    </div>
  );
};

export default SignUp;
