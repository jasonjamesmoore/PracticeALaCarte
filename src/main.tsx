import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { AuthSessionProvider } from "./Auth/AuthSessionContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <AuthSessionProvider>
    <App />
  </AuthSessionProvider>
  // </React.StrictMode>
);
