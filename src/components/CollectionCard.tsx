import React from 'react';


interface InputProps {
  name?: string;
  Image?: string | any;
}

const CollectionCard: React.FC<InputProps> = (props) => {

  return (
<div className='flex gap-2 items-center justify-start my-3  flex-col m-1 mb-4 group  '>
<div className=" flex flex-col gap-3 items-center justify-center ">
      <img src={props.Image} alt={props.name} className="flex border border-gray_100 rounded-md w-44 h-44 object-contain"/>
      <p className="text-center">{props.name}</p>
    </div>
</div>
  );
};

export default CollectionCard;