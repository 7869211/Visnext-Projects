import React, { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { IoChevronBackOutline, IoChevronDown } from "react-icons/io5";
import { DropDownOption } from "@/interfaces";

interface DropdownProps {
  options: DropDownOption[];
  onSelect: (option: DropDownOption) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: DropDownOption, event: Event) => {
    if (option.value === "action2" || option.value === "back") {
      event.preventDefault();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
    onSelect(option);
  };

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className="bg-[#ffffff] h-10 w-5 rounded-tr rounded-br border border-[#CCCCCC]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <IoChevronDown
            className={`ml-[1px] h-4 w-4 text-[#575D6D] transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        side="bottom"
        align="end"
        className="bg-white border shadow-lg rounded p-2 mt-2 max-w-[250px] border-[#CBD2E0] z-50"
      >
        {options.map((option, index) => (
          <DropdownMenu.Item
            key={index}
            className="flex items-center justify-between p-2 hover:bg-[#8C268C] hover:border-[#8C268C] hover:rounded hover:text-white text-sm text-[#575D6D] h-9 mt-1"
            onSelect={(event) => handleSelect(option, event)}
          >
            {option.value === "back" && <IoChevronBackOutline />}
            <span>{option.label}</span>
            {option.icon}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default Dropdown;
