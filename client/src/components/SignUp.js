import React, { useContext, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { UserContext } from "../UserContext";

const SignUp = () => {
  const { setUser } = useContext(UserContext);
  const [formType, setFormType] = useState("signIn");
  const { enqueueSnackbar } = useSnackbar();

  const initialValues = {
    email: "",
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    username: Yup.string().when("formType", {
      is: "signUp",
      then: Yup.string().required("Username is required"),
    }),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setErrors }) => {
    const endpoint =
      formType === "signIn"
        ? "http://localhost:5555/login"
        : "http://localhost:5555/users";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const responseData = await response.json();

      if (response.ok) {
        setUser(responseData);
        enqueueSnackbar(
          formType === "signIn" ? "Sign in successful" : "Sign up successful",
          { variant: "success" }
        );
      } else {
        setErrors(responseData.errors);
        enqueueSnackbar("Error during sign up/in", { variant: "error" });
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrors({ network: "A network error occurred." });
      enqueueSnackbar("Network error", { variant: "error" });
    }
  };

  const handleOAuthSignIn = (provider) => {
    const oauthWindow = window.open(`/auth/${provider}`, "_blank");
    oauthWindow.focus();
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => handleSubmit(values, actions)}>
        {({ values }) => (
          <Form>
            <Field type="email" name="email" placeholder="Email" />
            <ErrorMessage name="email" component="div" />

            {formType === "signUp" && (
              <>
                <Field type="text" name="username" placeholder="Username" />
                <ErrorMessage name="username" component="div" />
              </>
            )}

            <Field type="password" name="password" placeholder="Password" />
            <ErrorMessage name="password" component="div" />

            <div>
              <button type="button" onClick={() => setFormType("signUp")}>
                Sign Up
              </button>
              <button type="button" onClick={() => setFormType("signIn")}>
                Sign In
              </button>
            </div>

            <button type="submit">
              {formType === "signUp" ? "Create Account" : "Log In"}
            </button>
            <ErrorMessage name="network" component="div" />
          </Form>
        )}
      </Formik>
      <h2>Or Sign In with</h2>
      <button onClick={() => handleOAuthSignIn("google")}>Google</button>
    </div>
  );
};

export default SignUp;
