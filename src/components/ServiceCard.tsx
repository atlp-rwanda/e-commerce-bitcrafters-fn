import React from 'react';

interface InputProps {
  heading?: string;
  subheading?: string;
  color?: string | any;
  icon:any
}

const ServiceCard: React.FC<InputProps> = (props) => {

  return (
<div className='flex gap-2 items-center justify-start my-3 flex-col tablet:w-[30%]'>
    <div className='bg-gray rounded-full p-3'>
        <div className='bg-black rounded-full p-3'>
            {props.icon}
        </div>
    </div>

<div className="" >
    <h3 className='font-semibold text-center text-lg my-2'>{props.heading}</h3>
    <p className='text-center'>{props.subheading}</p>
</div>

</div>
  );
};

export default ServiceCard;