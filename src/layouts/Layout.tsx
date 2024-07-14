import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import LoSiNavbar from "../components/LoSiNavbar.tsx";

export default function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export function LoSiLayout() {
  return (
    <>
      <LoSiNavbar />
      <Outlet />
      <Footer />
    </>
  );
}
