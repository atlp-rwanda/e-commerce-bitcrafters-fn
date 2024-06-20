import Logo from "../assets/images/Bit.Shop-white.svg"
import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
import { CiTwitter } from "react-icons/ci";
import { FaWhatsapp } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";


const Footer: React.FC = () => {
  const date= new Date()
let year = date.getFullYear()

  return (
    <footer className="bg-black w-full ">
    <div className='footer bg-black w-full p-5 px-10 flex flex-row flex-wrap justify-between flex-1 items-start py-12'>
  
      <div className='items-start justify-center flex flex-col w-[90%] mb-10 tablet:mb-0 tablet:w-[30%] space-y-4'>
    <img alt="logo" src={Logo}  className='r w-24'/>
    <p className='text-xs text-gray-400 text-start w-[70%]'>We have your satisfaction in mind Lorem ipsum dolor sit amet consectetur. In eu aliquet orci ac </p>
 
    <div className="flex-between space-x-2">
      <div className="border p-1 border-gray_100 rounded-full">
      <CiLinkedin/>
      </div>
      <div className="border p-1 border-gray_100 rounded-full">
      <FaGithub/>
      </div>
      <div className="border p-1 border-gray_100 rounded-full">
      <CiTwitter/>
      </div>
    </div>
    </div>
    <div className='items-start justify-center flex flex-col w-[40%] bigphone:w-[12%] space-y-2 mb-10 phone:mb-0'>
   <p className='text-gray-200 font-semibold text-sm text-white'>Account</p>
    <p className=' text-xs  text-start hover:white transition-all'><Link to="/">My Account</Link></p>
    <p className='text-xs  text-start hover:white transition-all'><Link to="/">Login / Register</Link></p>
    <p className='text-xs  text-start hover:white transition-all'><Link to="/">Cart</Link></p>
    <p className='text-xs  text-start hover:white transition-all'><Link to="/">Wishlist</Link></p>
    <p className='text-xs  text-start hover:white transition-all'><Link to="/">Shop</Link></p>
    </div>
    <div className='items-start justify-center flex flex-col w-[40%] bigphone:w-[12%] space-y-2 mb-10 phone:mb-0'>
    <p className='text-white font-semibold text-sm'>Information</p>
     <p className='text-xs  text-start hover:white transition-all'><Link to="/FAQ">FAQ</Link></p>
     <p className='text-xs  text-start hover:white transition-all'><Link to="/about">About Us</Link></p>
     <p className='text-xs  text-start hover:white transition-all'><Link to="">Resources</Link></p>
     <p className='text-xs  text-start hover:white transition-all'><Link to="">Terms</Link></p>
     <p className='text-xs  text-start hover:white transition-all'><Link to="/privacyPolicy">Privacy Policy</Link></p>
     </div>

    <div className='items-start justify-center flex flex-col w-[80%] bigphone:w-[25%]  mt-4 bigphone:mt-1 space-y-2 mb-10 phone:mb-0'>
    <p className='text-white font-semibold text-sm'>Contact Us</p>
    
    <div className="flex-between items-start space-x-2">
<FaWhatsapp color="white" size={20}/>
<div>
<p className='text-xs text-gray-200 text-start text-white'>Whatsapp</p>
<p className='text-xs text-gray-400 text-start hover:text-gray-200 transition-all '><Link to={""}>+250 788 888 888</Link></p>

</div>
    </div>
    <div className="flex-between items-start space-x-2">
<FaPhone color="white" size={20}/>
<div>
<p className='text-xs text-gray-200 text-start  text-white'>Call Us</p>
<p className='text-xs text-gray-400 text-start hover:text-gray-200 transition-all '><Link to={"tel:+250 788 888 888"}>+250 788 888 888</Link></p>

</div>
    </div>
    <div className="flex-between items-start space-x-2">
<MdOutlineEmail color="white" size={20}/>
<div>
<p className='text-xs text-gray-200 text-start  text-white'>Email Us</p>
<p className='text-[10px] tablet:text-xs text-gray-400 text-start hover:text-gray-200 transition-all '><Link to={"bitcrafter.andela@gmail.com"}>bitcrafter.andela@gmail.com</Link></p>

</div>
    </div>

    </div>

    </div>
    <div className="p-6 flex items-center w-[80%] m-auto justify-center border-t-[1px] border-gray_100">

    <p className='text-xs text-gray-400'>&copy; {year} All rights reserved - Bitcrafters Andela Team</p>

    </div>

    </footer>
  )
};

export default Footer;
