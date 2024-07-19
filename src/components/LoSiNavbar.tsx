import React, { useState } from "react";
import Logo from "../assets/images/Bit.Shop.svg";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import SearchComponent from "./SearchComponent";
import "react-toastify/dist/ReactToastify.css";

interface NavbarProps {
  burgerShown?: boolean;
  showSearch?: boolean;
}

const Navbar: React.FC<NavbarProps> = (props) => {

  const [showSearch, setShowSearch] = useState(props.showSearch || false);

  
  return (
    <div className=" w-full flex flex-col  ">
    <nav className="navbar-container  w-full border-b-1 p-8 flex-between space-x-2 border-b-[1px] border-gray_100">
      <div className="nav-logo w-[20%] ">
        <img src={Logo} alt="Logo" className="w-24 object-contain " />
      </div>
      <div className="nav-link flex-between  w-[30%] hidden tablet:flex">
        <ul className="flex-between space-x-4">
          <li>
            <Link to="" className="text-sm">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-sm">
              About
            </Link>
          </li>
          <li>
            <Link to="" className="text-sm">
              Shop
            </Link>
          </li>
          <li>
            <Link to="" className="text-sm">
              Contact
            </Link>
          </li>
        </ul>
      </div>
      <div className="nav-icons flex-between hidden tablet:flex">
        <ul className="flex-between space-x-4">
          <li>
            <div className="search-container bg-gray rounded-sm flex-between space-x-2 p-2 cursor-pointer" onClick={()=>setShowSearch(!showSearch)}>
              <p className="text-xs">search here</p>
              <CiSearch />
            </div>
          </li>
          </ul>
        </div>
  
        <div className="flex gap-10 items-center">
          <CiSearch
            className="text-xl flex tablet:hidden"
            onClick={() => setShowSearch(!showSearch)}
          />
        </div>
      </nav>
      {showSearch && (
        <div className="absolute top-24 w-full h-[75%] tablet:h-[70%] z-10 transition-all duration-300">
          <SearchComponent
          hideSearch={()=>{setShowSearch(false)}}
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;
