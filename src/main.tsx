import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "./App";
import "./index.css";
import { register } from "swiper/element/bundle";
import { RouterProvider } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import 'react-toastify/dist/ReactToastify.css';

register();
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
