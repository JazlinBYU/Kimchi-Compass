import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import OAuthSignIn from "./OAuthSignIn"; // Assuming this component handles OAuth

const SignUp = () => {
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

  const handleSignUpSubmit = (values) => {
    // Handle sign-up submit
  };

  const handleSignInSubmit = (values) => {
    // Handle sign-in submit
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
      <OAuthSignIn />
    </div>
  );
};

export default SignUp;
