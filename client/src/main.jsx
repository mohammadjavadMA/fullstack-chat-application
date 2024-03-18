import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { Login } from "./components/Login.jsx";
import { PageNotFound } from "./components/PageNotFound.jsx";
import { Call } from "./components/Call.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/chats", element: <App /> },
  { path: "*", element: <PageNotFound /> },
  { path: "/chats/search", element: <App /> },
  { path: "/chats/u/:username", element: <App /> },
  { path: "/call/:username", element: <Call /> },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
