import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";

const formFields = [
  { name: "name", label: "Name", type: "text" },
  { name: "rating", label: "Rating", type: "number" },
  { name: "image_url", label: "Image URL", type: "text" },
  { name: "phone_number", label: "Phone Number", type: "text" },
  { name: "address", label: "Address", type: "text" },
];

const initialValues = formFields.reduce((values, field) => {
  values[field.name] = "";
  return values;
}, {});

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  rating: Yup.number().min(0).max(5).required("Rating is required"),
  image_url: Yup.string().url("Invalid URL").required("Image URL is required"),
  phone_number: Yup.string()
    .matches(/^\d+$/, "Phone number must be numeric")
    .required("Phone number is required"),
  address: Yup.string().required("Address is required"),
});

const AddRestaurantForm = () => {
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await fetch("http://localhost:5555/restaurants", {
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
          {formFields.map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name}>{field.label}:</label>
              <Field type={field.type} name={field.name} />
              <ErrorMessage name={field.name} component="div" />
            </div>
          ))}
          <button type="submit" disabled={isSubmitting}>
            Add Restaurant
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default AddRestaurantForm;
