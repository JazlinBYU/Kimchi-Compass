import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import FormComp from "../components/Form";

const Edit = () => {
  return (
    <div className="main">
      <h2>Edit Profile</h2>
      <div>
        <FormComp />
      </div>
    </div>
  );
};

export default Edit;
