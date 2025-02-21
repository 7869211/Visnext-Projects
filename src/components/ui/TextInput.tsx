import React from 'react';

interface TextInputProps {
  label: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ label, placeholder, onChange }) => (
  <div className="flex flex-col gap-1 h-20">
    <label className="text-base text-gray-800 font-semibold">{label}</label>
    <input
      type="text"
      className="text-base font-bold text-gray-800 w-full bg-transparent border-2 rounded-md border-gray-300 focus:outline-none p-3"
      placeholder={placeholder}
      onChange={(e) => onChange && onChange(e.target.value)}
    />
  </div>
);

export default TextInput;
