import React, { useEffect, useState } from "react";
import Hero from "../assets/images/black-lady.svg";
import Star from "../assets/images/star.svg";
import { Link } from "react-router-dom";
import { HiOutlineShoppingBag } from "react-icons/hi2";

import SectionHeader from "../components/SectionHeader.tsx";
import MainProductCard from "../components/MainProductCard.tsx";
import Button from "../components/Button.tsx";
import MacBook from "../assets/images/macbook.svg";
import { FaArrowRight } from "react-icons/fa6";
import ServicesSection from "../components/servicesSection.tsx";
import CollectionCard from "../components/CollectionCard.tsx";
import axiosClient from "../hooks/AxiosInstance.tsx";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";

interface Product {
  id: string;
  images: string[];
  name: string;
  price: string;
  discount: string;
  discription: string;
  rating: number;
}

const Home: React.FC = () => {
  const [newArrivalProducts, setNewArrivalProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newArrivalPage, setNewArrivalPage] = useState(1);
  const [featuredPage, setFeaturedPage] = useState(2);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [recommendedPage, setRecommendedPage] = useState(1);
  const [hasMoreRecommended, setHasMoreRecommended] = useState(true);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(false);
  const productsPerPage = 8;
  const client = axiosClient();

  const fetchNewArrivalProducts = async (page: number) => {
    try {
      const response = await client.get(`/collections/products/all?page=${page}`);
      setNewArrivalProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching new arrival products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeaturedProducts = async (page: number) => {
    try {
      const response = await client.get(`/collections/products/all?page=${page}`);
      setFeaturedProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching featured products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendedProducts = async (page: number) => {
    setIsLoadingRecommended(true);
  try {
    const response = await client.get(
      `/collections/products?page=${page}&limit=${productsPerPage}`,
    );
    const newProducts = response.data.products;
    setRecommendedProducts(newProducts);
    setHasMoreRecommended(newProducts.length === productsPerPage)
  } catch (error) {
    console.error("Error fetching recommended products:", error);
  } finally {
    setIsLoadingRecommended(false);
  }
};

  useEffect(() => {
    fetchNewArrivalProducts(newArrivalPage);
    fetchFeaturedProducts(featuredPage);
    fetchRecommendedProducts(1); 

    const intervalId = setInterval(() => {
      setNewArrivalPage((prevPage) => (prevPage === 1 ? 2 : 1));
      setFeaturedPage((prevPage) => (prevPage === 2 ? 3 : 2));
      // setRecommendedPage((prevPage) => (prevPage === 2 ? 3 : 2));
    }, 60000); 

    return () => clearInterval(intervalId); 
  }, []);

  useEffect(() => {
    fetchNewArrivalProducts(newArrivalPage);
    fetchFeaturedProducts(featuredPage);
    // fetchRecommendedProducts(recommendedPage)
  }, [newArrivalPage, featuredPage]);

   useEffect(() => {
     if (recommendedPage > 1) {
       fetchRecommendedProducts(recommendedPage);
     }
   }, [recommendedPage]);

  const handlePreviousRecommendations = () => {
    if (recommendedPage > 1) {
      setRecommendedPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextRecommendations = () => {
    setRecommendedPage((prevPage) => prevPage + 1);
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

      <div className="section-container px-2 tablet:px-10 my-10">
        <SectionHeader title="New Arrival" />
        <div className="product-container flex flex-wrap items-center justify-center tablet:justify-start gap-5 tablet:gap-10 my-5">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            newArrivalProducts.length > 0 ? (
              newArrivalProducts.map((product) => (
                <MainProductCard
                  key={product.id}
                  id={product.id}
                  Image={product.images[0]}
                  name={product.name}
                  price={product.price}
                  discount={product.discount}
                  discription={product.discription}
                  rating={product.rating}
                />
              ))
            ) : (
              <>
                <MainProductCard
                  id="1"
                  Image="https://m.media-amazon.com/images/I/81S533RgkwL._AC_UF350,350_QL80_.jpg"
                  name="Apple Headphone"
                  price="20.000"
                  discount="21.000"
                  discription="Apple product for apple users. Vibrant music"
                  rating={2.5}
                />
                <MainProductCard
                  id="2"
                  Image="https://m.media-amazon.com/images/I/81S533RgkwL._AC_UF350,350_QL80_.jpg"
                  name="Apple Headphone"
                  price="20.000"
                  discount="21.000"
                  discription="Apple product for apple users. Vibrant music"
                  rating={4.6}
                />
                <MainProductCard
                  id="3"
                  Image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSmWOWXGp9I_mdd1_VqNOnINHYJghuPgx2zg&s"
                  name="Apple Headphone"
                  price="20.000"
                  discount="21.000"
                  discription="Apple product for apple users. Vibrant music"
                  rating={3}
                />
              </>
            )
          )}
        </div>
      </div>

      <div className="section-container px-2 tablet:px-10 my-10">
        <SectionHeader title="Categories" />
        <div className="product-container flex flex-wrap gap-5 tablet:gap-10 my-5 items-center">
          <CollectionCard
            Image="https://m.media-amazon.com/images/I/81S533RgkwL._AC_UF350,350_QL80_.jpg"
            name="Electronics"
          />
          <CollectionCard
            Image="https://i0.wp.com/woodwoon.com/wp-content/uploads/2023/01/BC0004-bedroom-chair-furniture-brand-in-pakistan-woodwoon.webp?fit=1024%2C1024&ssl=1"
            name="Furniture"
          />
          <CollectionCard
            Image="https://www.corebase-clothing.com/cdn/shop/products/T-Shirt-Premium-Navy-1080-new-230223_f817e7f7-5019-4568-9677-4fb2b5987d98.jpg?v=1677227766"
            name="Clothing"
          />
        </div>
      </div>

      <div className="section-container px-2 tablet:px-10 my-10">
        <SectionHeader title="Featured Products" />
        <div className="product-container flex flex-wrap gap-5 tablet:gap-10 my-5">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <MainProductCard
                  key={product.id}
                  id={product.id}
                  Image={product.images[0]}
                  name={product.name}
                  price={product.price}
                  discount={product.discount}
                  discription={product.discription}
                  rating={product.rating}
                />
              ))
            ) : (
              <>
                <MainProductCard
                  id="1"
                  Image="https://m.media-amazon.com/images/I/81S533RgkwL._AC_UF350,350_QL80_.jpg"
                  name="Apple Headphone"
                  price="20.000"
                  discount="21.000"
                  discription="Apple product for apple users. Vibrant music"
                  rating={2.5}
                />
                <MainProductCard
                  id="2"
                  Image="https://m.media-amazon.com/images/I/81S533RgkwL._AC_UF350,350_QL80_.jpg"
                  name="Apple Headphone"
                  price="20.000"
                  discount="21.000"
                  discription="Apple product for apple users. Vibrant music"
                  rating={4.6}
                />
                <MainProductCard
                  id="3"
                  Image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSmWOWXGp9I_mdd1_VqNOnINHYJghuPgx2zg&s"
                  name="Apple Headphone"
                  price="20.000"
                  discount="21.000"
                  discription="Apple product for apple users. Vibrant music"
                  rating={3}
                />
              </>
            )
          )}
        </div>
      </div>

      <div className="section-container px-2 tablet:px-10 my-10">
        <SectionHeader title="Recommended Product" />
        <div className="product-container flex flex-wrap gap-5 tablet:gap-10 my-5">
          {isLoadingRecommended ? (
            <p>Loading...</p>
          ) : recommendedProducts.length > 0 ? (
            recommendedProducts.map((product) => (
              <MainProductCard
                key={product.id}
                id={product.id}
                Image={product.images[0]}
                name={product.name}
                price={product.price}
                discount={product.discount}
                discription={product.discription}
                rating={product.rating}
              />
            ))
          ) : (
            <p>No recommendations available at the moment.</p>
          )}
        </div>
        <div className="flex justify-center items-center mt-5 space-x-4">
          {recommendedPage > 1 && !isLoadingRecommended && (
            <button
              className="text-[#FA8232] cursor-pointer hover:text-[#d66a1f] flex items-center"
              onClick={handlePreviousRecommendations}
            >
              <GrFormPrevious className="mr-3" size={20} />
            </button>
          )}
          {hasMoreRecommended && !isLoadingRecommended && (
            <button
              className="text-[#FA8232] cursor-pointer hover:text-[#d66a1f] flex items-center"
              onClick={handleNextRecommendations}
            >
              <GrFormNext className="ml-1" size={20} />
            </button>
          )}
        </div>

      </div>

      <div className="section-container px-2 tablet:px-10 my-10 w-full">
        <SectionHeader title="Promotion" />
        <div className="promotion-container flex flex-wrap-reverse gap-5 tablet:gap-10 my-5 p-10 bg-black rounded-md">
          <div className="content tablet:w-[45%] flex flex-col gap-5 justify-center">
            <p className="text-white self-start">For a limited time only</p>
            <h2 className="text-2xl font-bold text-white">Macbook Pro</h2>
            <p className="text-white tablet:w-[50%]">
              Apple M1 Max Chip. 32GB Unified Memory, 1TB SSD Storage
            </p>
            <div className="w-[50%]">
              <Button
                value="Buy Now"
                icon={<FaArrowRight className="text-xl text-white" />}
                color={"#FA8232"}
                reverse={true}
              />
            </div>
          </div>
          <div className="image-container tablet:w-[45%] flex justify-end">
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
      <ServicesSection />
    </div>
  );
};

export default Home;