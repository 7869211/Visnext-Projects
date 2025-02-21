import React from "react";

interface InputProps {
  label?: string;
  type?: "text" | "password" | "date";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  mode?: "default" | "pink" | "dark";
  readOnly?: boolean;
  name?: string;
  customStyles?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  mode,
  readOnly,
  name,
  customStyles,
}) => {
  const modeContainerStyles =
    mode === "pink"
      ? `border-[#DC9BDC] text-[#A732A7]`
      : mode === "dark"
      ? `bg-[#130313] text-sm text-white  border-[#8C268C]  focus:outline-none focus:ring-1 focus:ring-[#A732A7] focus:border-[#A732A7]`
      : `border-[#9FA4B1] text-[#858B9B] bg-white`;

  return (
    <div
      className={`flex flex-col border p-1.5 pb-2 rounded h-[58px] gap-1 ${modeContainerStyles} ${customStyles}`}
    >
      <label
        className={`block text-xs font-light tracking-widest ${
          mode === "dark" && "uppercase"
        }`}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        name={name}
        className={`grow text-xs font-normal w-full bg-transparent focus:outline-none
          ${
            mode === "pink"
              ? "text-sm text-[#8C268C] placeholder-[#8C268C]"
              : mode === "dark"
              ? "text-white placeholder-[#7e617e] "
              : "!text-xs text-[#575D6D] placeholder-[#BABEC8] !placeholder-text-center"
          }`}
        placeholder={placeholder}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
    </div>
  );
};

export default Input;
