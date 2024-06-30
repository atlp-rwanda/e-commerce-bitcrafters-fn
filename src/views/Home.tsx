import React from "react";
import Hero from "../assets/images/black-lady.svg";
import Star from "../assets/images/star.svg";
import { Link } from "react-router-dom";
import { HiOutlineShoppingBag } from "react-icons/hi2";

const Home: React.FC = () => {
  return (
    <div className="main-container px-10 py-5">
      <div className="section-container tablet:flex justify-between items-center tablet:px-10">
        <div className="hero-content flex flex-col gap-10 items-start relative">
          <div className="star1 absolute top-5 right-0">
            <img src={Star} alt="star1" />
          </div>

          <h3 className="hero-text text-3xl phone:text-4xl tablet:text-7xl font-light w-[70%]">
            Elevate your{" "}
            <span className="font- font-light italic underline">market</span>{" "}
            experience
          </h3>
          <p className="w-[80%] tablet:w-[60%] text-sm">
            Get the latest products on the market at affordable dealsLorem ipsum
            dolor sit amet consectetur. In eu aliquet orci ac risus lobortis{" "}
          </p>
          <Link to="" className="flex gap-2 rounded-full bg-black p-3 px-6">
            <p className="text-white text-sm">Shop Now</p>
            <HiOutlineShoppingBag color="white" />
          </Link>
        </div>
        <div className="hero-container relative w-[90%] tablet:w-[50%] mt-10 tablet:mt-1">
          <img src={Hero} alt="hero image w-[70%]" />
          <div className="star2 absolute phone:top-5 tablet:top-[80%] bigphone:bottom-5 tablet:left-[-50%] w-10">
            <img src={Star} alt="star2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
