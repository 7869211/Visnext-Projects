import React from "react";

interface InputProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  mode?: "default" | "pink";
  placeholder?: string;
  classes?: string;
}

const TextArea: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  mode,
  placeholder,
  classes,

}) => {
  const containerStyles =
    mode === "pink"
      ? `border-[#DC9BDC] text-[#A732A7]`
      : `border-[#9FA4B1] text-[#858B9B]`;

  return (
    <div
      className={`flex flex-col border border-gray-100 p-1.5 pb-2 rounded gap-1 ${containerStyles} ${classes}`}
    >
      <label className="block text-xs font-light">{label}</label>
      <textarea
        value={value}
        rows={2}
        className={`grow text-xs font-normal w-full bg-transparent focus:outline-none resize-none 
          ${
            mode === "pink"
              ? "text-[#8C268C] placeholder-[#8C268C]"
              : "text-[#575D6D] placeholder-[#575D6D]"
          }`}
        placeholder={placeholder}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
    </div>
  );
};

export default TextArea;
