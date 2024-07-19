import React, { useState, useEffect, useCallback } from 'react';
import "react-toastify/dist/ReactToastify.css";
import axiosClient from "../hooks/AxiosInstance";
import { IoClose } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { ThreeDots } from 'react-loader-spinner';

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
      const response = await client.get(`collections/products/all/search`, {
        params: {
          query,
          minPrice: byMinPrice,
          maxPrice: byMaxPrice,
        }
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

  const debouncedSearch = useCallback(debounce(searchProducts, 300), [query, byMinPrice, byMaxPrice]);

  useEffect(() => {
    debouncedSearch();
    return () => debouncedSearch.cancel();
  }, [query, byMinPrice, byMaxPrice, debouncedSearch]);

  return (
    <div className=" relative w-[90%] phone:w-[80%] h-[75%] phone:h-[100%] m-auto  p-5 bg-neutral-50 shadow-2xl rounded border border-neutral-200 flex flex-col justify-between  transition-all">
      <p className='font-semibold text-center text-base  phone:text-2xl my-2 text-black'>Search Here</p>
      <IoClose className="text-4xl text-gray p-2 cursor-pointer bg-black align-baseline self-end absolute right-5 top-5 rounded-full" onClick={props.hideSearch}/>
      <div className='flex flex-wrap gap- mx-auto w-full  items-center'>
        <div className='m- w-[40%] phone:w-[30%] '>
          <p className='text-xs phone:text-sm text-black'>Name or category</p>
          <div className={'input border border-gray_100 bg-white my-2 rounded-sm w-full flex  items-center'} >
            <input 
              type="search" 
              name="search" 
              title='search here' 
              placeholder="search here"
              onChange={(event) => setQuery(event.target.value)}
              value={query}
              className='rounded p-1 phone:p-2 outline-none w-full text-black text-xs phone:text-sm'
            />
          </div>
        </div>
        <div className='m-2  w-[40%] phone:w-[30%]'>
          <p className='text-xs phone:text-sm text-black'> Minimum Price</p>
          <div className={'input border border-gray_100 bg-white my-2 rounded-sm w-full flex gap-2 items-center'} >
            <input 
              type="number" 
              name="minPrice" 
              title='minimum price' 
              value={byMinPrice}
              placeholder="Minimum price"
              className='rounded p-1 phone:p-2 outline-none w-full text-black text-xs phone:text-sm'
              onChange={(event) => setByMinPrice(event.target.value)}
            />
          </div>
        </div>
        <div className='m-2  w-[40%] phone:w-[30%]'>
          <p className='text-xs phone:text-sm text-black'>Maximum Price</p>
          <div className={'input border border-gray_100 bg-white my-2 rounded-sm w-full flex gap-2 items-center'} >
            <input 
              type="number" 
              name="maxPrice" 
              title='maximum price' 
              placeholder="Maximum price"
              value={byMaxPrice}
              className='rounded p-1 phone:p-2 outline-none w-full text-black  text-xs phone:text-sm'
              onChange={(event) => setByMaxPrice(event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="response-container h-full flex items-start flex-col overflow-y-auto  border border-neutral-500 p-2 my-2 ">
        {isLoading ? (
                <div className="w-full text-gray  m-auto items-center justify-center flex flex-col gap-3">

                <ThreeDots visible={true} height="50" width="50" color="rgb(38 38 38)" radius="5" ariaLabel="three-dots-loading" />
              </div>
        ) : searchedProducts.length > 0 ? (
          searchedProducts.map((product: any, index: any) => (
            <Link to={`/product-detail/${product.id}`} key={index} className="flex items-center  tablet:justify-start gap-5 my-2 border-b border-neutral-500 pb-2 w-[80%] mx-auto hover:bbg-gray">
              <img className="w-16 h-16 object-cover rounded-sm" src={product.images[0]} alt="" />
             
              <div className='flex flex-col phone:flex-rowk gap-1 phone:gapn-5 w-[75%]'>
              <p className='text-xs phone:text-sm w-full  font-medium text-black'>{product.name}</p>
              <p className='text-xs phone:text-sm w-full  text-[10px] text-black italic'>{product.category}</p>
              <p className='text-xs phone:text-sm  w-full  text-medium text-black'>Rwf {product.price}</p>

              </div>

            </Link>
          ))
        ) : (
          <div  className="w-full text-gray  m-auto items-center justify-center flex flex-col gap-3">No items match your criteria</div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;