import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.jsx";
import GlobalStyles from "./components/GlobalStyles/index";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GlobalStyles>
      <App />
    </GlobalStyles>
  </StrictMode>
);
