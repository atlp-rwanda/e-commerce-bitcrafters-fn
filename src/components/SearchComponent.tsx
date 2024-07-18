import React, { useState, useEffect, useCallback } from "react";
import "react-toastify/dist/ReactToastify.css";
import axiosClient from "../hooks/AxiosInstance";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import debounce from "lodash/debounce";

interface SearchProps {
  hideSearch?: (event: any) => void;
  onClick?: (event: any) => void;
  name?: string;
}

const SearchComponent: React.FC<SearchProps> = (props) => {
  const client = axiosClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [byMaxPrice, setByMaxPrice] = useState<string>("");
  const [byMinPrice, setByMinPrice] = useState<string>("");
  const [searchedProducts, setSearchedProducts] = useState<Array<object>>([]);

  const searchProducts = async () => {
    if (query === "" && byMinPrice === "" && byMaxPrice === "") {
      setSearchedProducts([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await client.get(`collections/products/search`, {
        params: {
          query,
          minPrice: byMinPrice,
          maxPrice: byMaxPrice,
        },
      });

      if (response.status === 200) {
        setSearchedProducts(response.data.items);
      } else {
        setSearchedProducts([]);
      }
    } catch (err: any) {
      setSearchedProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useCallback(debounce(searchProducts, 300), [
    query,
    byMinPrice,
    byMaxPrice,
  ]);

  useEffect(() => {
    debouncedSearch();
    return () => debouncedSearch.cancel();
  }, [query, byMinPrice, byMaxPrice, debouncedSearch]);

  return (
    <div className="w-[90%] phone:w-[80%] h-[75%] phone:h-[70%] m-auto relative p-5 bg-gray my-5 rounded flex flex-col justify-between mt-10 transition-all">
      <p className="font-semibold text-center text-base  phone:text-2xl my-2">
        Search Here
      </p>
      <IoClose
        className="text-xl text-black align-baseline self-end absolute right-5 top-5 rounded-full"
        onClick={props.hideSearch}
      />
      <div className="flex flex-wrap gap- mx-auto w-full  items-center">
        <div className="m- w-[40%] phone:w-[30%] ">
          <p className="text-xs phone:text-sm">Name or category</p>
          <div
            className={
              "input border border-gray_100 bg-white my-2 rounded-sm w-full flex  items-center"
            }
          >
            <input
              type="search"
              name="search"
              title="search here"
              placeholder="search here"
              onChange={(event) => setQuery(event.target.value)}
              value={query}
              className="rounded p-1 phone:p-2 outline-none w-full text-black text-xs phone:text-sm"
            />
          </div>
        </div>
        <div className="m-2  w-[40%] phone:w-[30%]">
          <p className="text-xs phone:text-sm"> Minimum Price</p>
          <div
            className={
              "input border border-gray_100 bg-white my-2 rounded-sm w-full flex gap-2 items-center"
            }
          >
            <input
              type="number"
              name="minPrice"
              title="minimum price"
              value={byMinPrice}
              placeholder="Minimum price"
              className="rounded p-1 phone:p-2 outline-none w-full text-black text-xs phone:text-sm"
              onChange={(event) => setByMinPrice(event.target.value)}
            />
          </div>
        </div>
        <div className="m-2  w-[40%] phone:w-[30%]">
          <p className="text-xs phone:text-sm">Maximum Price</p>
          <div
            className={
              "input border border-gray_100 bg-white my-2 rounded-sm w-full flex gap-2 items-center"
            }
          >
            <input
              type="number"
              name="maxPrice"
              title="maximum price"
              placeholder="Maximum price"
              value={byMaxPrice}
              className="rounded p-1 phone:p-2 outline-none w-full text-black  text-xs phone:text-sm"
              onChange={(event) => setByMaxPrice(event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="response-container overflow-y-auto h-[55%] rounded bg-white border border-gray_100 p-2">
        {isLoading ? (
          <div>Loading...</div>
        ) : searchedProducts.length > 0 ? (
          searchedProducts.map((product: any, index: any) => (
            <Link
              to={`/product-detail/${product.id}`}
              key={index}
              className="flex items-center justify-between tablet:justify-start gap-5 my-2 border-b border-gray pb-2 w-[80%] mx-auto hover:bbg-gray"
            >
              <img
                className="w-16 h-16 object-cover rounded-sm"
                src={product.images[0]}
                alt=""
              />

              <div className="flex flex-col phone:flex-row gap-1 phone:gap-5">
                <p className="text-xs phone:text-sm">{product.name}</p>
                <p className="text-xs phone:text-sm">
                  <span className="text-[10px] text-black italic px-2">
                    Price:
                  </span>
                  Rwf {product.price}
                </p>
                <p className="text-xs phone:text-sm">
                  <span className="text-[10px] text-black italic px-2">
                    Category:
                  </span>
                  {product.category}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div>No items match your criteria</div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
