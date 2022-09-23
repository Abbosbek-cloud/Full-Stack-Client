import { StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Suspense fallback={<div>Loading...</div>}>
    <StrictMode>
      <Router>
        <App />
        <ToastContainer />
      </Router>
    </StrictMode>
  </Suspense>
);
