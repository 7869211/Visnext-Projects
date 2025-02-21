import React, { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

interface InputWithDropdownProps {
  label?: string;
  options: string[];
  placeholder?: string;
  value?: string;
  mode?: "default" | "dark";
  onSelect?: (value: string) => void;
  height?: string; // Made height optional
}

const InputWithDropdown: React.FC<InputWithDropdownProps> = ({
  label = "",
  options,
  placeholder,
  onSelect,
  mode,
  height,
  value,
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions =
    (options &&
      options.length > 0 &&
      options.filter((option) =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      )) ||
    [];

  const handleOpenSelect = () => {
    if(!isOpen){
      setInputValue("")
    }
    setIsOpen(!isOpen)
  }
  const handleOptionSelect = (option: string) => {
    setInputValue(option);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div
      className={`relative flex flex-col gap-1 ${
        mode === "dark" ? "" : "h-20"
      }`}
    >
      {label && (
        <label className="text-base text-gray-800 font-semibold">{label}</label>
      )}
      <div className={`relative ${mode === "dark" && "bg-[#521252]"}`}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onClick={handleOpenSelect}
          className={`text-base w-full bg-transparent focus:outline-none p-3 pr-10 
            ${
              mode === "dark"
                ? `text-sm text-white placeholder-white border border-[#8C268C] rounded focus:ring-1 focus:ring-[#A732A7] focus:border-[#A732A7]`
                : "text-gray-800 border-2 rounded-md border-gray-300 font-bold"
            } ${height ? `h-[${height}]` : "h-[57px]"}`}
          placeholder={placeholder}
        />
        <MdKeyboardArrowDown
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-transform w-6 h-6 ${
            isOpen ? "rotate-180" : "rotate-0"
          } ${mode === "dark" ? "text-white" : "text-gray-600"}`}
          onClick={handleOpenSelect}
        />
        {isOpen && (
          <ul
            className={`absolute left-0 right-0 max-h-40 mt-1 overflow-y-auto rounded-md shadow-lg z-[1] ${
              mode === "dark"
                ? "bg-[#521252] text-sm text-white placeholder-white border border-[#8C268C] rounded focus:ring-1 focus:ring-[#A732A7] focus:border-[#A732A7] hover:ring-[#A732A7]"
                : "bg-white border border-gray-300"
            }`}
          >
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                onClick={() => handleOptionSelect(option)}
                className="cursor-pointer p-2 hover:[background-color:#7F267F]"
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default InputWithDropdown;
