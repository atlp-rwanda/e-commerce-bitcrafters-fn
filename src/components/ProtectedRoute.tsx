import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { jwtDecode } from "jwt-decode";
import {
  setIsLoggedIn,
  setAuthToken,
  setAuthRole,
  setAuthUserId,
} from "../redux/authSlice";
import { DecodedToken } from "../views/Login";

interface ProtectedRouteProps {
  requiredRole: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isLoggedIn,
    shallowEqual,
  );
  const authToken = useSelector(
    (state: RootState) => state.auth.authToken,
    shallowEqual,
  );
  const authRole = useSelector(
    (state: RootState) => state.auth.authRole,
    shallowEqual,
  );
  if (!authToken) {
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken: DecodedToken = jwtDecode(authToken);
    const userRole = decodedToken.userRole;

    if (decodedToken.userRole !== "admin" && !decodedToken.otp && userRole !== "buyer") {
      dispatch(setIsLoggedIn(false));
      dispatch(setAuthToken(null));
      dispatch(setAuthRole(null));
      dispatch(setAuthUserId(null));
      return <Navigate to="/" />;
    }

    if (!isLoggedIn || (authRole && authRole !== requiredRole)) {
      return <Navigate to="/" />;
    }
  } catch (error) {
    dispatch(setIsLoggedIn(false));
    dispatch(setAuthToken(null));
    dispatch(setAuthRole(null));
    dispatch(setAuthUserId(null));
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
