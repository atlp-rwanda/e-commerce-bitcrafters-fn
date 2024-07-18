import Home from "../views/Home";
import Login from "../views/Login";
import TwoFactorAuth from "../views/TwoFactorAuth";
import ErrorPage from "../views/ErroPage";
import Layout, { LoSiLayout } from "../layouts/Layout";
import ResetPassword from "../views/ChangePassword";
import RequestPasswordChange from "../views/RequestPasswordChange";
import AboutPage from "../views/AboutPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignupForm from "../views/signup";
import VerifyEmail from "../views/verifyEmail";
import EmailVerified from "../views/emailVerified";
import InvalidToken from "../views/invalidToken";
import ForgotPassword from "../views/ForgotPassword";
import DashLayout from "../layouts/DashLayout";
import UsersTable from "../views/admin/UsersTable";
import ProtectedRoute from "../components/ProtectedRoute";
import Profile from "../views/UserProfile";
import AddProductForm from "../views/seller/AddProductForm";
import SingleProduct from "../views/SingleProduct";
import ViewProducts from "../views/seller/viewProduct";
import SellerDashLayout from "../layouts/SellerDashLayout";
import ViewSingleProduct from "../views/seller/viewSingleProduct";
import UserCart from "../views/UserCart";
import Checkout from "../views/checkout";
import XMobileMoney from "../views/XMobileMoney";
import PaymentPage from '../components/StripePayment';
import ConfirmationPage from '../components/Confirmation';
import UpdateProductForm from "../views/seller/UpdateProductForm";
import UseWishList from "../views/UseWishList";
import UserOrderTrack from "../views/UserOrderTrack"; 
import UserOrders from "../views/UserOrders"; 
import PublicRoute,{PrivateRoute} from "../components/PublicRoute";

const Routers: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/request" element={<RequestPasswordChange />} />
          <Route path="/cart" element={<PrivateRoute />} >
          <Route path="/cart" element={<UserCart />} />
          </Route>
          <Route path="/wishList" element={<PrivateRoute />} >
          <Route path="/wishList" element={<UseWishList />} />
          </Route>
          <Route path="/checkout" element={<PrivateRoute />} >
          <Route path="/checkout" element={<Checkout />} />
          </Route>
          <Route path="/orders" element={<PrivateRoute />}>
            <Route path="/orders" element={<UserOrders />} />
          </Route>
          <Route path="/view-edit-profile" element={<PrivateRoute />} >
            <Route path="/view-edit-profile" element={<Profile />} />
          </Route>
          <Route path="/order/:orderId" element={<UserOrderTrack />} />
          <Route
            path="/users/reset-password/:token"
            element={<ResetPassword />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<TwoFactorAuth />} />
          <Route path="/users/verify/:token" element={<VerifyEmail />} />
          <Route path="/email-verified" element={<PublicRoute />} >
          <Route path="/email-verified" element={<EmailVerified />} />
          </Route>
          <Route path="/products/:productId" element={<SingleProduct />} />
          <Route path="/invalid-token" element={<InvalidToken />} />
          <Route path="/verify-otp" element={<TwoFactorAuth />} />
          <Route path="/mobileMoney" element={<XMobileMoney />} />
          <Route path="/payment/:orderId" element={<PaymentPage />} />
          <Route path="/confirmation/:orderId" element={<ConfirmationPage />} />
        </Route>
        <Route element={<PublicRoute/>}>
          <Route element={<LoSiLayout/>}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignupForm />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin" element={<DashLayout />}>
            <Route index element={<UsersTable />} />
            <Route path="/admin/users" element={<UsersTable />} />
          </Route>
          <Route
            path="/users/reset-password/:token"
            element={<ResetPassword />}
          />
        </Route>
        <Route element={<ProtectedRoute requiredRole="seller" />}>
          <Route path="/seller" element={<SellerDashLayout />}>
            <Route index element={<ViewProducts />} />
            <Route path="/seller/products" element={<ViewProducts />} />
            <Route path="/seller/addProduct" element={<AddProductForm />} />
            <Route path="/seller/updateProduct/:productId" element={<UpdateProductForm/>} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute requiredRole="buyer" />}>
          <Route path="/buyer" element={<Layout />}>
            <Route index element={<Home />} />
          </Route>
        </Route>
        <Route path="/*" element={<ErrorPage />} />
        <Route
          path="/product-detail/:productId"
          Component={ViewSingleProduct}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
