import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import QuestionsPage from "./Components/Pages/QuestionsPage";
import "./styles/global.scss";
import ContentPage from "./Components/Pages/ContentPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/questions",
    element: <QuestionsPage />,
  },
  {
    path: "/contents-detail",
    element: <ContentPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
