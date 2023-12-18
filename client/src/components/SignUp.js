import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

const SignUp = () => {
  const navigate = useNavigate();
  const { updateUser } = useOutletContext();
  const [isSignUp, setIsSignUp] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const loginSchema = Yup.object().shape({
    username: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
  });

  const signUpSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    username: Yup.string().required("Required"),
    password: Yup.string().required("Required"),
  });

  const handleSubmit = async (values) => {
    const endpoint = isSignUp ? "/food_users" : "/login";

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((resp) => {
        if (resp.ok) {
          resp.json().then((userObj) => {
            updateUser(userObj);
            navigate(`/profile/${userObj.id}`);
            enqueueSnackbar(
              isSignUp ? "Sign up successful!" : "Login successful!",
              { variant: "success" }
            );
          });
        } else {
          resp.json().then((err) => {
            enqueueSnackbar(err.message, { variant: "error" });
          });
        }
      })
      .catch((err) => {
        enqueueSnackbar("An error occurred during login.", {
          variant: "error",
        });
      });
  };

  const handleOAuthSignIn = (provider) => {
    const oauthWindow = window.open(`/authorize/${provider}`, "_blank");
    oauthWindow.focus();
  };

  return (
    <div className="main">
      <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
      <Formik
        initialValues={{ email: "", username: "", password: "" }}
        validationSchema={isSignUp ? signUpSchema : loginSchema}
        onSubmit={handleSubmit}>
        {() => (
          <Form>
            {isSignUp && (
              <>
                <label>Email</label>
                <Field name="email" type="email" className="block" />
                <ErrorMessage name="email" component="div" />
              </>
            )}
            <label>Username</label>
            <Field name="username" type="text" className="block" />
            <ErrorMessage name="username" component="div" />
            <label>Password</label>
            <Field name="password" type="password" className="block" />
            <ErrorMessage name="password" component="div" />
            <div className="buttons">
              <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
            </div>
          </Form>
        )}
      </Formik>
      <div>
        {isSignUp ? (
          <>
            <p>
              Already have an account?{" "}
              <button onClick={() => setIsSignUp(false)}>Login here</button>
            </p>
          </>
        ) : (
          <>
            <p>
              New to Kimchi-Compass?{" "}
              <button onClick={() => setIsSignUp(true)}>
                Sign up for a free account
              </button>
            </p>
            <p>
              <h2>Or Sign In with</h2>
              <button onClick={() => handleOAuthSignIn("google")}>
                Google
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUp;
