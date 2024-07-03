import React, { useState } from "react";
import Hero from "../assets/images/black-lady.svg";
import Star from "../assets/images/star.svg";
import { Link } from "react-router-dom";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { FaTimes, FaCommentDots } from "react-icons/fa";
import Chat from "./chat/Chat";

const Home: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
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
      <button
        data-testid="chat-button"
        onClick={toggleChat}
        className="fixed bottom-10 right-10 bg-slate-200 text-black p-3 rounded-full shadow-lg z-50"
      >
        {isChatOpen ? <FaTimes size={22} /> : <FaCommentDots size={70} />}
      </button>
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-end z-40">
          <div
            data-testid="chat-container"
            className="bg-white w-full max-w-sm md:max-w-lg h-5/6 rounded shadow-lg p-4 relative overflow-hidden mr-10 mb-10"
          >
            <button
              onClick={toggleChat}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            ></button>
            <Chat />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
