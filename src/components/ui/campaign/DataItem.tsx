import React, { useState } from 'react';
import { FaFile } from 'react-icons/fa6';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { BiSolidPencil } from 'react-icons/bi';
import CircleCheckBox from '@/components/ui/CircleCheckBox';
import Input from '../Input';
import TextArea from '../TextArea';

interface DataItemProps {
    tooltips: boolean,
    title: string;
    description: string;
    size?: string;
    campaign: string;
    isSelected: boolean;
    onToggleSelect: () => void;
    onSave: (updatedTitle?: string, updatedDescription?: string) => void;
    onDelete?: () => void;
    type?: string;
    height?: string;
    border?: boolean;
    isNew?: boolean;
}

const DataItem: React.FC<DataItemProps> = ({ tooltips, title, description, size, isSelected, onToggleSelect, onSave, onDelete, type = 'doc', height, border, isNew = false }) => {
    const [isEditing, setIsEditing] = useState(isNew);
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedDescription, setEditedDescription] = useState(description);

    const handleSave = () => {
        if (isEditing) {
            if (type == "doc")
                onSave(editedDescription)
            else onSave(editedDescription, editedTitle)
        }
        setIsEditing(!isEditing);
    };

    return (
        <div
            className={`${border && `border`} flex rounded-lg hover:cursor-pointer z-30 ${isSelected ? 'bg-[#F8E9F8]' : 'bg-white'}`}
            style={{ minHeight: height, maxHeight: "200px" }}
        >
            {tooltips &&
                <div className={`flex flex-col items-center justify-between py-3 px-2 min-w-11 ${isSelected ? 'bg-[#EBC1EB40]' : 'bg-[#F0F1F3]'}`}>
                    {!isEditing ?
                        <CircleCheckBox selected={isSelected} onToggle={onToggleSelect} />
                        : <CircleCheckBox selected={isSelected} onToggle={onToggleSelect} />}
                    <div className={`flex flex-col items-center gap-2 ${isSelected && `text-[#8C268C]`}`}>
                        <button type="button">
                            <RiDeleteBin5Fill className="w-5 h-5" onClick={onDelete} />
                        </button>
                        <button className={`rounded-sm w-7 h-6 justify-items-center ${isSelected && isEditing ? `bg-[#8C268C] text-white` : isEditing ? 'bg-[#30343E] text-white' : ''}`} type="button"
                            onClick={() => handleSave()}>
                            <BiSolidPencil className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            }
            <div className="flex flex-col justify-between w-full py-4 px-5 gap-2">
                {isEditing ? (
                    <div className="flex flex-col gap-1">
                        <Input label={type == 'doc' ? "FILE NAME" : "QUESTION"} mode={isSelected ? "pink" : "default"} value={editedTitle} readOnly={type == 'doc' ? true : false} onChange={(value) => setEditedTitle(value)} />
                        <TextArea label={type == 'doc' ? "DESCRIPTION" : "ANSWER"} mode={isSelected ? "pink" : "default"} value={editedDescription} onChange={(value) => setEditedDescription(value)} />
                    </div>
                ) : (
                    <>
                        <div className="overflow-hidden">
                            <h2 className={`font-base font-medium break-all ${isSelected ? 'text-[#8C268C]' : 'text-[#575D6D]'}`}>{title}</h2>
                            <p className={`text-xs font-light break-all mt-1 ${isSelected ? 'text-[#BA54BA]' : 'text-[#858B9B]'}`}>{description}</p>
                        </div>
                    </>
                )}
                <div className={`flex justify-between items-center text-[10px] ${isSelected ? 'text-[#8C268C]' : 'text-[#575D6D]'}`}>
                    <span>Campaign</span>
                    {size &&
                        <div className="flex items-center gap-1">
                            <FaFile className="w-3 h-3 p-[1px]" />
                            <span>{size}</span>
                        </div>}
                </div>
            </div>
        </div>
    );
};

export default DataItem;
