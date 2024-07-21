import { Outlet } from "react-router-dom";
import SideNav from "../components/SellerSideNav";
import Footer from "../components/Footer";
import SellerDashboardStats from "../views/dashboard/sellerDashboardStats";

const SellerDashLayout = () => {
  return (
    <div className=" bg-dashColor flex-1 flex flex-col w-full ">
      <div className="flex">
        <SideNav />
        <div className="sm:flex-1 w-full max-w-full">
          <SellerDashboardStats />
          <div className="">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SellerDashLayout;
