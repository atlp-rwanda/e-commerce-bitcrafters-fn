import React, { useState } from "react";
import Hero from "../assets/images/black-lady.svg";
import Star from "../assets/images/star.svg";
import { Link } from "react-router-dom";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { FaTimes, FaCommentDots } from "react-icons/fa";
import Chat from "./chat/Chat";
import SectionHeader from "../components/SectionHeader.tsx";
import MainProductCard from "../components/MainProductCard.tsx";
import Button from "../components/Button.tsx";
import MacBook from "../assets/images/macbook.svg"
import { FaArrowRight } from "react-icons/fa6";
import ServicesSection from "../components/servicesSection.tsx";
import CollectionCard from "../components/CollectionCard.tsx";


const Home: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  return (
    <div className="main-container px-10 py-5 flex flex-col gap-5">
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
          <img src={Hero} alt="Hero" />
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

      <div className="section-container px-2 tablet:px-10 my-10">
        <SectionHeader title="New Arrival" />
        <div className="product-container flex flex-wrap items-center justify-center tablet:justify-start gap-5 tablet:gap-10 my-5">

        <MainProductCard
        id="1"
        Image="https://m.media-amazon.com/images/I/81S533RgkwL._AC_UF350,350_QL80_.jpg"
        name="Apple Headphone"
        price="20.000"
        discount="21.000"
        discription="Apple product for apple users. Vibrant music"
        rating={"2.5"}
        />
        <MainProductCard
        id="1"
        Image="https://m.media-amazon.com/images/I/81S533RgkwL._AC_UF350,350_QL80_.jpg"
        name="Apple Headphone"
        price="20.000"
        discount="21.000"
        discription="Apple product for apple users. Vibrant music"
        rating={"4.6"}
        />
        <MainProductCard
        id="1"
        Image={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSmWOWXGp9I_mdd1_VqNOnINHYJghuPgx2zg&s"}
        name="Apple Headphone"
        price="20.000"
        discount="21.000"
        discription="Apple product for apple users. Vibrant music"
        rating={"3"}
        />
        <MainProductCard
        id="1"
        Image="https://m.media-amazon.com/images/I/81S533RgkwL._AC_UF350,350_QL80_.jpg"
        name="Apple Headphone"
        price="20.000"
        discount="21.000"
        discription="Apple product for apple users. Vibrant music"
        rating={"3.6"}
        />
        <MainProductCard
        id="1"
        Image="https://m.media-amazon.com/images/I/81S533RgkwL._AC_UF350,350_QL80_.jpg"
        name="Apple Headphone"
        price="20.000"
        discount="21.000"
        discription="Apple product for apple users. Vibrant music"
        rating={"4.6"}
        />
        <MainProductCard
        id="1"
        Image="https://m.media-amazon.com/images/I/81S533RgkwL._AC_UF350,350_QL80_.jpg"
        name="Apple Headphone"
        price="20.000"
        discount="21.000"
        discription="Apple product for apple users. Vibrant music"
        rating={"4"}
        />
        </div>
      </div>
      
      <div className="section-container px-2 tablet:px-10 my-10">
        <SectionHeader title="Categories  " />
        <div className="product-container flex flex-wrap gap-5 tablet:gap-10 my-5 items-center " >
          

    <CollectionCard
    Image={"https://m.media-amazon.com/images/I/81S533RgkwL._AC_UF350,350_QL80_.jpg"}
    name="Electronics"
    />
    <CollectionCard
    Image={"https://i0.wp.com/woodwoon.com/wp-content/uploads/2023/01/BC0004-bedroom-chair-furniture-brand-in-pakistan-woodwoon.webp?fit=1024%2C1024&ssl=1"}
    name="Furniture"
    />
    <CollectionCard
    Image={"https://www.corebase-clothing.com/cdn/shop/products/T-Shirt-Premium-Navy-1080-new-230223_f817e7f7-5019-4568-9677-4fb2b5987d98.jpg?v=1677227766"}
    name="Clothing"
    />

    <CollectionCard
    Image={"https://m.media-amazon.com/images/I/81S533RgkwL._AC_UF350,350_QL80_.jpg"}
    name="Electronics"
    />
    <CollectionCard
    Image={"https://i0.wp.com/woodwoon.com/wp-content/uploads/2023/01/BC0004-bedroom-chair-furniture-brand-in-pakistan-woodwoon.webp?fit=1024%2C1024&ssl=1"}
    name="Furniture"
    />
    <CollectionCard
    Image={"https://www.corebase-clothing.com/cdn/shop/products/T-Shirt-Premium-Navy-1080-new-230223_f817e7f7-5019-4568-9677-4fb2b5987d98.jpg?v=1677227766"}
    name="Clothing"
    />

    
        </div>
        </div>

        <div className="section-container px-2 tablet:px-10 my-10">
        <SectionHeader title="Featured Products" />
        <div className="product-container flex flex-wrap gap-5 tablet:gap-10 my-5">

        <MainProductCard
        id="1"
        Image="https://m.media-amazon.com/images/I/81S533RgkwL._AC_UF350,350_QL80_.jpg"
        name="Apple Headphone"
        price="20.000"
        discount="21.000"
        discription="Apple product for apple users. Vibrant music"
        rating={"2.5"}
        />
        <MainProductCard
        id="1"
        Image="https://m.media-amazon.com/images/I/81S533RgkwL._AC_UF350,350_QL80_.jpg"
        name="Apple Headphone"
        price="20.000"
        discount="21.000"
        discription="Apple product for apple users. Vibrant music"
        rating={"4.6"}
        />
        <MainProductCard
        id="1"
        Image={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSmWOWXGp9I_mdd1_VqNOnINHYJghuPgx2zg&s"}
        name="Apple Headphone"
        price="20.000"
        discount="21.000"
        discription="Apple product for apple users. Vibrant music"
        rating={"3"}
        />
   
        </div>
      </div>
      <div className="section-container px-2 tablet:px-10 my-10 w-full">
        <SectionHeader title="Promotion" />

        <div className="promotion-container flex flex-wrap-reverse gap-5 tablet:gap-10 my-5 p-10 bg-black rounded-md">
          <div className="content tablet:w-[45%] flex flex-col gap-5 justify-center">
            <p className="text-white self-start">For a limited time only</p>

            <h2 className="text-2xl font-bold text-white">
              Macbook Pro
            </h2>

            <p className="text-white tablet:w-[50%]">Apple M1 Max Chip. 32GB Unified Memory, 1TB SSD Storage</p>
            <div className="w-[50%]">
           <Button 
          value="Buy Now"
          icon={<FaArrowRight className="text-xl text-white"/>}
          color={"#FA8232"}
          reverse={true}
          />
            </div>
        
          </div>
          <div className="image-container tablet:w-[45%] flex justify-end ">
            <div className="relative">
              <img src={MacBook} alt="MacBook" />
              <div className="circle bg-gray rounded-full p-2 w-28 h-28 absolute flex items-center justify-center top-0">
                <div className="inner-circle bg-black rounded-full w-24 h-24 p-2 flex items-center justify-center">
                  <p className="text-white">300.000</p>
                </div>
              </div>
            </div>
            
          </div>
   
          </div>

          </div>
<ServicesSection/>
    </div>
  );
};

export default Home;
