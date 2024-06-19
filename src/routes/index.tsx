import Home from "../views/Home";
import Login from "../views/Login";
import TwoFactorAuth from "../views/TwoFactorAuth";
import Layout from "../components/Layout";
import ResetPassword from "../views/ChangePassword";
import RequestPasswordChange from "../views/RequestPasswordChange";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignupForm from '../views/signup';
import VerifyEmail from '../views/verifyEmail';
import EmailVerified from '../views/emailVerified';
import InvalidToken from '../views/invalidToken';
const Routers: React.FC = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} /> 
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/request" element={<RequestPasswordChange />} />
          <Route
            path="/users/reset-password/:token"
            element={<ResetPassword />}
          />
        <Route path="/verify-otp" element={<TwoFactorAuth />} />
        <Route path="/signup" element={<SignupForm />} />
          <Route path="/users/verify/:token" element={<VerifyEmail />} />
          <Route path="/email-verified" element={<EmailVerified />} />
        <Route path="/invalid-token" element={<InvalidToken />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
