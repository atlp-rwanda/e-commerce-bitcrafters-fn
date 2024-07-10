import { Outlet } from "react-router-dom";
import SideNav from "../components/SellerSideNav";
import Footer from "../components/Footer";
import SellerDashboardStats from "../views/dashboard/sellerDashboardStats";

const SellerDashLayout = () => {
  return (
    <div className=" bg-dashColor flex-1 flex flex-col w-full min-h-screen">
      <div className="flex flex-1 p-4 space-x-4">
        <SideNav />
        <div className="flex-1">
          <SellerDashboardStats />
          <div className="mt-20">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SellerDashLayout;
