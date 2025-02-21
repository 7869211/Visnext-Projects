import React from "react";

interface ToggleSwitchProps {
  enabled: boolean;
  mode?: "default" | "pink"; // Define the mode
  onToggle: (enabled: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, mode = "default", onToggle }) => {
  const containerStyles =
    mode === "pink"
      ? `${enabled ? "bg-[#BA54BA] border-[#BA54BA]" : "bg-[#F1F5F9] border-[#D5D7DE]"}`
      : `${enabled ? "bg-[#A732A7] border-[#A732A7]" : "bg-[#330A33] border-[#A732A7]"}`;

  const toggleStyles =
    mode === "pink"
      ? `${!enabled ? `bg-[#A732A7]` : `bg-red`}`
      : `${enabled ? `bg-[white]` : `bg-[#EBC1EB]`}`;

  return (
    <div
      onClick={() => onToggle(!enabled)}
      className={`relative inline-flex items-center rounded-full cursor-pointer transition-colors border 
        hover:outline hover:outline-1 hover:outline-offset-1 focus:ring-1 focus:ring-offset-1
        ${mode == "pink" ? 'h-[18px] w-8 hover:outline-[#DC9BDC] focus:ring-[#DC9BDC]' : 'h-6 w-11'} ${containerStyles}`}
    >
      <span
        className={`inline-block ${mode == "pink" ? 'h-[14px] w-[14px]' : 'h-4 w-4'} transform rounded-full transition-transform 
        ${enabled ? mode == "pink" ? "translate-x-[15px]" : "translate-x-5" : "translate-x-0.5"} ${toggleStyles}`}
      />
    </div>
  );
};

export default ToggleSwitch;
