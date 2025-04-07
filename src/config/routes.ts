import { lazy } from "react";

const Home = lazy(() => import("../pages/Home"));
const AddList = lazy(() => import("../pages/AddList"));
const ViewList = lazy(() => import("../pages/ViewList"));
const NotFound = lazy(() => import("../pages/NotFound"));

export const routes = [
  {
    path: "/",
    element: Home,
    exact: true,
  },
  {
    path: "/add-list",
    element: AddList,
  },
  {
    path: "/view-list",
    element: ViewList,
  },
  {
    path: "*",
    element: NotFound,
  },
];
