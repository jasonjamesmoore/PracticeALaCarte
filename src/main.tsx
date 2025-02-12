import React from "react";
import ReactDOM from "react-dom/client";
// import { MantineProvider } from "@mantine/core";
// import '@mantine/core/styles.css';
import App from "./App.tsx";
// import "./index.css";
// import { BrowserRouter } from "react-router-dom";
import { AuthSessionProvider } from "./Auth/AuthSessionContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <AuthSessionProvider>
      <App />
    </AuthSessionProvider>
  // </React.StrictMode>
);
