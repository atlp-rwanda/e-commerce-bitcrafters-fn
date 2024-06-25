import Home from "../views/Home";
import Login from "../views/Login";
import TwoFactorAuth from "../views/TwoFactorAuth";
import Layout from "../components/Layout";
import ResetPassword from "../views/ChangePassword";
import RequestPasswordChange from "../views/RequestPasswordChange";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Routers: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/request" element={<RequestPasswordChange />} />
          <Route
            path="/users/reset-password/:token"
            element={<ResetPassword />}
          />
        </Route>
        <Route path="/verify-otp" element={<TwoFactorAuth />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
