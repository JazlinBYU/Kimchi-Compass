import React from "react";
import ReactDOM from "react-dom/client"; // Import from 'react-dom/client'
import App from "./App";
import { UserProvider } from "./UserContext";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";

// Use createRoot to render the application
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <SnackbarProvider maxSnack={3}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SnackbarProvider>
    </UserProvider>
  </React.StrictMode>
);
