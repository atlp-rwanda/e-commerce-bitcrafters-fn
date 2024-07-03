import Home from "../views/Home";
import Login from "../views/Login";
import TwoFactorAuth from "../views/TwoFactorAuth";
import Layout from "../layouts/Layout";
import ResetPassword from "../views/ChangePassword";
import RequestPasswordChange from "../views/RequestPasswordChange";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignupForm from "../views/signup";
import VerifyEmail from "../views/verifyEmail";
import EmailVerified from "../views/emailVerified";
import InvalidToken from "../views/invalidToken";
import ForgotPassword from "../views/ForgotPassword";
// import AdminDashboard from "../views/AdminDashboard";
import DashLayout from "../layouts/DashLayout";
import UsersTable from "../views/admin/UsersTable";
import ProtectedRoute from "../components/ProtectedRoute";
import Profile from "../views/UserProfile";
import AddProductForm from "../views/seller/AddProductForm";
import SellerLayout from "../layouts/SellerLayout";

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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<TwoFactorAuth />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/users/verify/:token" element={<VerifyEmail />} />
          <Route path="/email-verified" element={<EmailVerified />} />
          <Route path="/invalid-token" element={<InvalidToken />} />
          <Route path="/verify-otp" element={<TwoFactorAuth />} />
          <Route path="/view-edit-profile" element={<Profile />} />
        </Route>
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<DashLayout />}>
            <Route index element={<UsersTable />} />
            <Route path="/admin/users" element={<UsersTable />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute requiredRole="seller" />}>
          <Route path="/seller" element={<SellerLayout />}>
            <Route path="/seller/addProduct" element={<AddProductForm />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
