import React, { useState } from 'react';
import Modal from 'react-modal';
import {FaRegEye } from "react-icons/fa";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { IoStar } from "react-icons/io5";
import { FaRegStar } from "react-icons/fa6";
import axiosClient from '../hooks/AxiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md';

// Modal.setAppElement('#root');

interface InputProps {
  name?: string;
  id: string;
  title?: string;
  addToWishList?: (event: any) => void;
  addTocart?: (event: any) => void;
  viewItem?: (event: any) => void;
  Image?: string | any;
  rating?: number;
  price?: string | any;
  discount?: string | any;
  discription?: string | any;
  deleteItem?: (event: any) => void;
}

const MainProductCard: React.FC<InputProps> = (props) => {
  const client = axiosClient();
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const notify = (message: string) => toast(message);


  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  const addProductToCart = async (productId: string, quantity: number) => {
    try {
      await client.post(`/cart/products/${productId}`, { quantity });
      navigate('/cart');
      notify("Product added to cart successfully!");
      closeModal();
    } catch (error: any) {
      if (error.response) {
        toast(`${error.response.data.message}`);
      } else if (error.request) {
        notify("No response received from the server.");
      } else {
        notify("Error setting up request.");
      }
    }
  };

  const handleViewItemClick = (productId: string) => {
    navigate(`/product-detail/${productId}`);
  };

  const renderStars = (rating: number = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? <IoStar key={i} color='orange' /> : <FaRegStar key={i} color='orange' />);
    }
    return stars;
  };
  return (
    <div className='flex gap-2 items-center justify-start my-3 flex-col basis-[40%] tablet:basis-[20%] h-[40%] m-1 mb-4 group'>
      <div className="image-container w-full rounded border shadow border-gray group-hover:blur-3 relative hover:scale-[1.03] transition-all">
        <div className='absolute rounded hidden group-hover:flex flex-col items-center justify-center gap-5 w-full h-full' style={{ backgroundColor: "rgba(0,0,0,.5)" }}>
          <div className="links flex gap-2 items-center justify-center w-full">
            <div className='bg-white hover:bg-orange rounded-full p-2 group flex items-center justify-center transition-all'>
              <div
          className="flex items-center gap-1 p-1 rounded-sm border border-gray cursor-pointer"
          onClick={props.deleteItem}
          data-testid="delete-icon"
        >
          <MdDelete className="text-red-500" />
        </div>

            </div>
            <div className='bg-white hover:bg-orange rounded-full p-2 group flex items-center justify-center transition-all'>
              <button onClick={openModal} data-testid="shopping-cart-icon">
                <AiOutlineShoppingCart className='text-xl text-black hover:text-white ml-[-2px] transition-all' />
              </button>
            </div>
            <div className='bg-white hover:bg-orange rounded-full p-2 group flex items-center justify-center transition-all'>
              <button aria-label="view item" onClick={() => handleViewItemClick(props.id)}>
                <FaRegEye className='text-xl text-black hover:text-white transition-all' />
              </button>
            </div>
          </div>
        </div>
        <div className='bg-gray h-32 tablet:h-40 px-2'>
          <img src={props.Image} alt={props.name} className='w-full h-full object-contain' />
        </div>
      </div>
      <div className='flex flex-col items-start my-2 w-full gap-2 justify-start px-1'>
        <p className='text-start font-semibold'>{props.name}</p>
        <div className='flex gap-4 items-center'>
          <div className="stars flex gap-2 items-center justify-center">
            {renderStars(props.rating)}
          </div>
          <p className='text-xs tablet:text-sm text-black'>{props.rating || 4.2}/5</p>
        </div>
        <div className='flex gap-5 items-center'>
          <p className='text-xs tablet:text-sm text-black font-semibold'>Rwf {props.price || 1000}</p>
          <p className='text-xs tablet:text-sm text-gray_100 line-through'>Rwf {props.discount || 1000}</p>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add Quantity"
        className="bg-white p-6 rounded-lg shadow-lg w-1/3 mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-2xl font-bold mb-4">Add to Cart</h2>
        <form role="form" onSubmit={(e) => {
          e.preventDefault();
          addProductToCart(props.id, quantity);
        }} className="flex flex-col gap-4">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Add to Cart</button>
          </div>
        </form>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default MainProductCard;
