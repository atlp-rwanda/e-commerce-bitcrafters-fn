import React from 'react';
import { FiGithub } from "react-icons/fi"
import { FaLinkedinIn } from "react-icons/fa";
import { Link } from 'react-router-dom';

interface InputProps {
  name?: string;
  title?: string;
  linkedin?: string|any;
  github?: string|any;
  Image?: string | any;
}

const TeamCard: React.FC<InputProps> = (props) => {

  return (
<div className='flex gap-2 items-center justify-start my-3  flex-col bigphone:w-[50%] bigphone:basis-[40%] tablet:w-[30%]  tablet:basis-[30%] h-[40%] m-1 mb-4 group  '>
    
<div className="image-container border border-gray_100 rounded-sm group-hover:blur-3 relative hover:scale-[1.03] transition-all " >
<div className='absolute  hidden group-hover:flex flex-col items-center justify-center gap-5 w-full h-full' style={{backgroundColor:"rgba(0,0,0,.5)"}}> 
<div className="links flex gap-2 items-center justify-center  w-full">
    <div className='bg-gray rounded-full p-2'>
    <Link to={props.github} >
        <FiGithub  className='text-xl text-black'data-testid="github-icon"/>
        </Link>
    </div>
    <div className='bg-gray rounded-full p-2'>
        <Link to={props.linkedin} >
         <FaLinkedinIn  className='text-xl text-black' data-testid="linkedin-icon"/>
        </Link>
       
    </div>
</div>
<p className='text-center text-xs text-gray '>{props.title}</p>
</div>
    <img src={props.Image} alt={props.name} />
</div>
<p className='text-center'>{props.name}</p>
</div>
  );
};

export default TeamCard;