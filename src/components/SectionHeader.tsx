import React from "react";

interface InputProps {
  title?: string;
  color?: string | any;
}

const SectionHeader: React.FC<InputProps> = (props) => {
  return (
    <div className="flex gap-2 items-center justify-start my-3">
      <div
        className="rec w-2 h-6 tablet:w-3 tablet:h-8 rounded-full"
        style={{ backgroundColor: props.color || "rgb(38 38 38)" }}
      ></div>
      <p>{props.title}</p>
    </div>
  );
};

export default SectionHeader;
