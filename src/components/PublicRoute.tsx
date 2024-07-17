import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { RootState } from "../redux/store";
import { toast } from 'react-toastify';

const PublicRoute: React.FC = () => {
  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isLoggedIn,
    shallowEqual,
  );

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};
export const PrivateRoute: React.FC = () => {
  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isLoggedIn,
    shallowEqual,
  );

  if (!isLoggedIn) {
    toast.error("Please Login")
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PublicRoute;
