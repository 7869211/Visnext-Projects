import React, { useState } from 'react';
import { FaCircleMinus, FaCirclePlus, FaGripVertical } from 'react-icons/fa6';

export interface IEmail {
  id: number;
  position: number;
  title: string;
  content?: string;
  day: number;
  selected?: boolean
  onClick?: () => void;
  onDayChange: (id: number, day: number) => void;
}

const EmailCard: React.FC<IEmail> = ({ id, position, title, day, selected = false, onClick, onDayChange }) => {
  const [value, setValue] = useState<number>(day);
  const [isHovered, setIsHovered] = useState(false);

  const handleIncrease = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    const newDay = value + 1;
    setValue(newDay);
    onDayChange(id, newDay);
  };

  const handleDecrease = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    const newDay = value > 0 ? value - 1 : 0;
    setValue(newDay);
    onDayChange(id, newDay);
  };

  const containerStyles = selected
    ? 'bg-[#F8E9F8] border-[#EBC1EB80]'
    : 'bg-white border border-[#F0F1F3] hover:bg-[#F0F1F3]';

  const textStyles = selected ? 'text-[#8C268C]' : 'text-[#575D6D]';

  return (
    <div
      className={`flex flex-row h-[84px] rounded-lg pt-2 pr-2 pb-2.5 pl-3 ${containerStyles} hover:cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className={`flex-1 flex flex-col justify-between ${textStyles} text-xs font-medium gap-1 overflow-hidden`}>
        <span className="text-ellipsis overflow-hidden break-all">{(position+1) + ' ' + title}</span>
        <div className={`flex min-h-7 w-[116px] rounded-3xl items-center ${isHovered ? `bg-white` : `bg-[#F7F8F9]`} px-2`}>
          {isHovered || selected ? (
            <>
              <button onClick={handleDecrease} aria-label="Decrease wait time">
                <FaCircleMinus className="w-4 h-4" />
              </button>
              <span className="grow text-center text-[10px]">{value} Day wait</span>
              <button onClick={handleIncrease} aria-label="Increase wait time">
                <FaCirclePlus className="w-4 h-4" />
              </button>
            </>
          ) : (
            <span className="grow text-center text-[10px]">{value} Day wait</span>
          )}
        </div>
      </div>
      <div className="w-4 h-4 p-1 flex items-center justify-center">
        <FaGripVertical className={`w-2 h-2 ${textStyles}`} />
      </div>
    </div>
  );
};

export default EmailCard;
