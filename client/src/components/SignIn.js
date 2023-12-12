import React from "react";
import SignInForm from "./SignInForm";
import RegisterForm from "./RegisterForm";
import OAuthSignIn from "./OAuthSignIn";

const SignIn = () => {
  return (
    <div>
      <SignInForm />
      <RegisterForm />
      <OAuthSignIn />
    </div>
  );
};

export default SignIn;
