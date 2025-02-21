import React from 'react';
import { FaCheck } from 'react-icons/fa6'; // Import the check icon

interface CircleCheckBoxProps {
  selected: boolean;
  onToggle: () => void;
  classes?:string;
  isDarkMode?: boolean;

}

const CircleCheckBox: React.FC<CircleCheckBoxProps> = ({ selected, onToggle, classes, isDarkMode }) => {
  return (
    <div
      className={`flex items-center justify-center w-[18px] h-[18px] rounded-full border transition-all cursor-pointer ${
        selected
          ? 'bg-[#A732A7] border-[#8C268C] text-white'
          : isDarkMode ? "bg-[#390D39] border-[#390D39]": "bg-[#BABEC8] border-[#BABEC8]"
      } ${classes}`}
      onClick={onToggle}
    >
      {selected && <FaCheck className="w-[13px] h-[13px]" />}
    </div>
  );
};

export default CircleCheckBox;
