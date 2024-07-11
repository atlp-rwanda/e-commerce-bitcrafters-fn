import React, { useState } from "react";
import { MdDelete, MdUpdate } from "react-icons/md";
import Modal from "./UpdateCartModal";

interface InputProps {
  name?: string;
  image?: string;
  price?: string | any;
  description?: string;
  seller?: string;
  quantity?: string | number;
  id?: any;
  category?: string;
  increment?: (event: any) => void;
  decrement?: (event: any) => void;
  deleteItem?: (event: any) => void;
  onClick?: (event: any) => void;
  updateQuantity?: (newQuantity: number) => void;
}

const CartProductCard: React.FC<InputProps> = (props) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleQuantityUpdate = (newQuantity: number) => {
    if (props.updateQuantity) {
      props.updateQuantity(newQuantity);
      closeModal();
    }
  };
  return (
    <div className="flex items-center p-2 justify-between border-gray_100 shadow-sm ">
      <div className="flex gap-3 items-center justify-between ">
        <div className="w-24 h-24 border border-gray bg-gray rounded-md p-2">
          <img
            src={props.image}
            alt=""
            className="w-full h-full  object-cover "
          />
        </div>

        <div className="description flex flex-col gap-[5px]">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold">{props.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium">Quantity:</p>
            <p className="text-xs"> {props.quantity}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium">Price:</p>
            <h1 className="text-sm font-bold">Rwf {props.price}</h1>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between gap-5">
        <div
          className="flex items-center gap-1 p-1 rounded-sm border border-gray cursor-pointer"
          onClick={props.deleteItem}
        >
          <p className="text-xs text-red-500 align-top">Delete</p>
          <MdDelete className="text-red-500" />
        </div>
        <div
          data-testid="update-quantity-button"
          className="flex items-center gap-1 p-1 rounded-sm border border-gray cursor-pointer"
          onClick={openModal}
        >
          <p className="text-xs text-green-500 align-top">Update</p>
          <MdUpdate className="text-green-500" />
        </div>

        <Modal
          isOpen={showModal}
          onClose={closeModal}
          onSubmit={handleQuantityUpdate}
          initialQuantity={props.quantity as number}
        />
      </div>
    </div>
  );
};

export default CartProductCard;
