import { lazy } from "react";
import ProtectedRoute from "./protectedRoutes";

const UserPage = lazy(() => import("../pages/users/Users"));
const SignIn = lazy(() => import("../pages/login/Login"));
const SignUp = lazy(() => import("../pages/signup/Signup"));

export const routes = [
  { path: "/", element: <ProtectedRoute children={<UserPage />} /> },
  { path: "/signin", element: <SignIn /> },
  { path: "/signup", element: <SignUp /> },
];
