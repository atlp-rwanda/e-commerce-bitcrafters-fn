import React from "react";

interface InputProps {
  value?: string;
  color?: string | any;
  rounded?: string;
  icon?: any;
  reverse?: boolean;
  textColor?: string | any;
  onClick?: (event: any) => void;
  disabled?: boolean;
  type?: "submit" | "reset" | "button" | undefined;
  showFull?: boolean;
  borderColor?: string | any;
  dataTestId: any;
}

const DashboardButton: React.FC<InputProps> = (props) => {
  return (
    <button
      data-testid={props.dataTestId}
      type={props.type}
      style={{
        backgroundColor: props.color || "rgb(38 38 38)",
        border: props.borderColor,
      }}
      className={`hover:bg-gray border border-gray rounded-sm mt-2 p-2 w-full border-none flex space-x-2`}
      onClick={props.onClick}
    >
      {props.icon}

      <p
        className={` text-xs  flex`}
        style={{ color: props.textColor || "white" }}
      >
        {props.value}
      </p>
    </button>
  );
};

export default DashboardButton;
