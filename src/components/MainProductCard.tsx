import React from 'react';
import { FaRegHeart } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from 'react-router-dom';
import { IoStar } from "react-icons/io5";
import { FaRegStar } from "react-icons/fa6";

interface InputProps {
  name?: string;
  id: string;
  title?: string;
  addToWishList?: (event: any) => void;
  addTocart?: (event: any) => void;
  viewItem?: (event: any) => void;
  Image?: string | any;
  rating?: string | any;
  price?: string | any;
  discount?: string | any;
  discription?: string | any;
}

const MainProductCard: React.FC<InputProps> = (props) => {

  return (
<div className='flex gap-2 items-center justify-start my-3  flex-col basis-[40%] tablet:basis-[20%] h-[40%] m-1 mb-4 group  '>
    
<div className="image-container w-full rounded border shadow- border-gray group-hover:blur-3 relative hover:scale-[1.03] transition-all " >
<div className='absolute rounded hidden group-hover:flex flex-col items-center justify-center gap-5 w-full h-full' style={{backgroundColor:"rgba(0,0,0,.5)"}}> 
<div className="links flex gap-2 items-center justify-center  w-full">
<div className='bg-white  hover:bg-orange rounded-full p-2 group flex items-center justify-center transition-all'>
    <Link to='' onClick={props.addToWishList}>
        <FaRegHeart  className='text-xl text-black hover:text-white transition-all'/>
        </Link>
    </div>
    <div className='bg-white  hover:bg-orange rounded-full p-2 group flex items-center justify-center transition-all'>
        <Link to="" onClick={props.addTocart}>
         < AiOutlineShoppingCart  className='text-xl text-black hover:text-white ml-[-2px] transition-all'/>
        </Link>
       
    </div>
    <div className='bg-white  hover:bg-orange rounded-full p-2 group flex items-center justify-center transition-all'>
        <Link to='' onClick={props.viewItem}>
         < FaRegEye className='text-xl text-black hover:text-white transition-all'/>
        </Link>
       
    </div>
</div>
</div>
<div className='bg-gray h-32  tablet:h-40 px-2'>
<img src={props.Image} alt={props.name} className=' w-full h-full object-contain'/>

</div>
</div>
<div className='flex flex-col items-start my-2 w-full gap-2 justify-start px-1'>

    <p className='text-start font-semibold'>{props.name}</p>
<div className='flex gap-4 items-center'>
    <div className="stars flex gap-2 items-center justify-center">
       {props.rating >= 1? <IoStar color='orange'/>: <FaRegStar color='orange'/>}
       {props.rating >= 2? <IoStar color='orange'/>: <FaRegStar color='orange'/>}
       {props.rating >= 3? <IoStar color='orange'/>: <FaRegStar color='orange'/>}
       {props.rating >= 4.4? <IoStar color='orange'/>: <FaRegStar color='orange'/>}
       {props.rating >= 4.5? <IoStar color='orange'/>: <FaRegStar color='orange'/>}
    </div>
    <p className='text-xs tablet:text-sm text-black'>{props.rating || 4.2}/5</p>

</div>
<div className='flex gap-5 items-center'>
        <p className='text-xs tablet:text-sm text-black font-semibold'>Rwf {props.price || 1000}</p>
        <p className='text-xs tablet:text-sm text-gray_100 line-through'>Rwf {props.price || 1000}</p>
    </div>
</div>

</div>
  );
};

export default MainProductCard;