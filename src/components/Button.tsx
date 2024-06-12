import PropTypes from "prop-types";
type Props = {
  /** Button description */
  variant?: "green" | "yellow" | "red";
  borderRadius?: "5px" | "10px" | "20px";
  align?: "center" | "start";
  padding?: "0px" | "5px" | "10px" | "20px";
  label?: string;
};
/** Our Button component */
const Button = ({
  variant = "green",
  borderRadius = "10px",
  align = "center",
  padding = "5px",
  label = "Press Me",
  ...restProps
}: Props) => {
  return (
    <div
      style={{
        padding: padding,
        textAlign: align,
        background: variant,
        borderRadius: borderRadius,
        width: 100,
        color: "white",
        fontFamily: "arial",
      }}
      {...restProps}
    >
      {label}
    </div>
  );
};

export default Button;

Button.prototype = {
  label: PropTypes.string,
  backgroundColor: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  onClick: PropTypes.func,
};
