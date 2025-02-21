"use client";

import { AvatarPermissionType } from "@/app/nextapi/avatars/models";

interface SelectProps {
  options: { value: AvatarPermissionType; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SelectComponent = ({
  options,
  value,
  onChange,
  className = "",
}: SelectProps) => {
  return (
    <select
      className={`border border-b-grey-2 p-4 rounded-lg text-b-purple-1 font-semibold dark:text-white ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SelectComponent;
