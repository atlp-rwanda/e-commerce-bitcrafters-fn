import { Outlet } from "react-router-dom";
import SideNav from "../components/SideNav";
import Footer from "../components/Footer";

const SellerLayout = () => {
  return (
    <div className=" bg-dashColor flex-1 flex flex-col w-full min-h-screen">
      <div className="flex flex-1 p-4 space-x-4">
        <SideNav />
        <div className="flex-1">
            <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SellerLayout;
