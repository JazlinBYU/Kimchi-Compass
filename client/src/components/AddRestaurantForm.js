import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

const AddRestaurantForm = () => {
  const { enqueueSnackbar } = useSnackbar();

  const initialValues = {
    name: "",
    rating: "",
    image_url: "",
    phone_number: "",
    address: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    rating: Yup.number().min(0).max(5).required("Rating is required"),
    image_url: Yup.string()
      .url("Invalid URL")
      .required("Image URL is required"),
    phone_number: Yup.string()
      .matches(/^\d+$/, "Phone number must be numeric")
      .required("Phone number is required"),
    address: Yup.string().required("Address is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        enqueueSnackbar("Restaurant added successfully", {
          variant: "success",
        });
        resetForm();
      } else {
        enqueueSnackbar("Failed to add restaurant", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Error submitting form", { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form>
          <div>
            <label htmlFor="name">Name:</label>
            <Field type="text" name="name" />
            <ErrorMessage name="name" component="div" />
          </div>
          <div>
            <label htmlFor="rating">Rating:</label>
            <Field type="number" name="rating" />
            <ErrorMessage name="rating" component="div" />
          </div>
          <div>
            <label htmlFor="image_url">Image URL:</label>
            <Field type="text" name="image_url" />
            <ErrorMessage name="image_url" component="div" />
          </div>
          <div>
            <label htmlFor="phone_number">Phone Number:</label>
            <Field type="text" name="phone_number" />
            <ErrorMessage name="phone_number" component="div" />
          </div>
          <div>
            <label htmlFor="address">Address:</label>
            <Field type="text" name="address" />
            <ErrorMessage name="address" component="div" />
          </div>
          <button type="submit" disabled={isSubmitting}>
            Add Restaurant
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default AddRestaurantForm;
