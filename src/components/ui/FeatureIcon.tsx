import React, { FC } from 'react';
import {
    FaGauge,
    FaEnvelopeOpen,
    FaArrowPointer,
    FaCheck,
    FaXmark
} from "react-icons/fa6";


interface FeatureIconProps {
    label: string;
    status: boolean;
}

const FeatureIcon: FC<FeatureIconProps> = ({ label, status }) => {
    const bgColor = status ? 'bg-[#10B981]' : 'bg-[#D14848]';

    return (
        <div className={`grid grid-cols-2 w-9 h-4 rounded shadow-md ${bgColor} transition-all duration-300 px-0.5 items-center justify-items-center`}>
            {label == "auto_pilot" ? <FaGauge className="text-white w-[11px] h-[11px]" />
                : label == "email_tracking" ? <FaEnvelopeOpen className="text-white w-[11px] h-[11px]" />
                    : <FaArrowPointer className="text-white w-[11px] h-[11px]" />}
            {status ?
                <FaCheck className="text-white w-[11px] h-[11px] justify-items-center" />
                : <FaXmark className="text-white w-[11px] h-[11px]" />}
        </div>
    );
};

export default FeatureIcon;
