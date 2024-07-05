import React from 'react';
import { MdDelete } from "react-icons/md";

interface InputProps {
  name?: string
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
}

const CartProductCard: React.FC<InputProps> = (props) => {

  return (
    <div className='flex items-center p-2 justify-between border-gray_100 shadow-sm '>
<div className='flex gap-3 items-center justify-between '>
    <div className='w-24 h-24 border border-gray bg-gray rounded-md p-2'>
    <img src={props.image} alt="" className='w-full h-full  object-cover '/>
    </div>

    <div className="description flex flex-col gap-[5px]">
        
        <div className='flex items-center gap-2'>
            <h1 className="text-sm font-semibold">{props.name}</h1>
        </div>
        <div className='flex items-center gap-2'>
            <p className="text-xs font-medium">Quantity:</p>
            <p className="text-xs"> {props.quantity}</p>
        </div>
        <div className='flex items-center gap-2'>
            <p className="text-xs font-medium">Price:</p>
            <h1 className="text-sm font-bold">Rwf {props.price}</h1>
        </div>

    </div>
</div>
<div className='flex flex-col items-center justify-between gap-5'>
    <div  className='flex items-center gap-1 p-1 rounded-sm border border-gray cursor-pointer' onClick={props.deleteItem}>
    <p className='text-xs text-red-500 align-top'>Delete</p>
        <MdDelete className='text-red-500'/>
    </div>
    

    <div className='flex bg-gray rounded-full border border-gray'>
        <p className='px-3 py-2 cursor-pointer' onClick={props.decrement}>-</p>
        <p className='px-3 py-2 bg-white'>{props.quantity}</p>
        <p className='px-3 py-2 cursor-pointer' onClick={props.increment}>+</p>
    </div>
</div>
    </div>
  );
};

export default CartProductCard;