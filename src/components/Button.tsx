import React from 'react';

interface InputProps {
  name?: string
  value?: string;
  color?: string | any;
  rounded?: string;
  icon?: any;
  reverse?: boolean;
  textColor?: string | any;
  onClick?: (event: any) => void;
  disabled?: boolean
  type?: "submit" | "reset" | "button" | undefined
}

const Button: React.FC<InputProps> = (props) => {
// const [showPassword, setShowPassword] = useState(false)

  return (
    <button type={props.type} style={{backgroundColor:props.color || "rgb(38 38 38)",display:"flex", flexDirection:props.reverse?"row-reverse" :"row"}}  className={` rounded-sm mt-2 px-4 w-full py-3 border-none flex space-x-2 items-center justify-center gap-2`} onClick={props.onClick}>
 {props.icon} 

 <p className={` text-sm`} style={{color:props.textColor || "white"}}>{props.value}</p>

    </button>
  );
};

export default Button;