import React,{ ReactNode } from "react";

interface ButtonProps {
  width?: string;
  height?: string;
  color?: "DarkPink" | "Pink" | "White" | "Gray" | "DarkGray" | "WhitePink";
  text: ReactNode;
  icon?: React.ReactNode;
  textSize?: string;
  textColor?: string;
  padding?: "sm" | "md" | "lg";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  classes?: string
}

const Button: React.FC<ButtonProps> = ({
  width = "full",
  height = "full",
  color = "DarkPink",
  text,
  icon,
  textSize = "lg",
  textColor,
  padding = "lg",
  onClick,
  disabled = false,
  classes
}) => {
  const paddingClasses = {
    xs: "px-0.5 py-0.5",
    sm: "px-1.5 py-1",
    md: "px-4 py-2",
    lg: "px-3 py-2",
  };

  const colorStyles = {
    // DarkPink: `bg-[#521252] hover:bg-[#701B70]`,
    DarkPink: `bg-[#A732A7] hover:bg-[#701B70]`,
    Pink: `bg-[#F8E9F8] hover:bg-[#EBC1EB]`,
    White: `bg-[#FFFFFF] hover:bg-[#EBECEF]`,
    Gray: `bg-[#F0F1F3] hover:bg-[#CFCFCF]`,
    WhitePink: `bg-[#FFFFFF] hover:bg-[#EBC1EB80]`,
    DarkGray: `bg-[#2D3648] hover:bg-[]`,
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${classes} flex rounded-md font-medium items-center text-center leading-none justify-center
        ${paddingClasses[padding]} ${
        colorStyles[color]
      }  text-${textSize} focus:ring-1 focus:ring-offset-1 hover:outline-[#DC9BDC] focus:ring-[#DC9BDC] ${
        disabled &&
        "disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed"
      }`}
      style={{ color: textColor, width: width, height: height }}
    >
      {icon && <span>{icon}</span>}
      {text && <span className="mx-auto px-1">{text}</span>}
    </button>
  );
};

export default Button;
