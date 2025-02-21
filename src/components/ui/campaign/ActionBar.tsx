import React from 'react';
import CircleCheckBox from '@/components/ui/CircleCheckBox';
import { BiGrid, BiListUl } from 'react-icons/bi';

interface ActionBarProps {
    selectedCount: number;
    totalDocs: number;
    onSelectAll: () => void;
    direction: 'row' | 'col';
    onChangeDirection: (dir: 'row' | 'col') => void;
}

const ActionBar: React.FC<ActionBarProps> = ({ selectedCount, totalDocs, onSelectAll, direction, onChangeDirection }) => {
    return (
        <div className="flex justify-between items-center">
            <CircleCheckBox selected={selectedCount === totalDocs} onToggle={onSelectAll} />
            <span className="text-sm text-[#6B7284]">
                <strong>{selectedCount}</strong> of <strong>{totalDocs}</strong> selected
            </span>
            <div className="flex space-x-2">
                <button
                    type="button"
                    className={`w-8 h-8 rounded ${direction === 'col' ? 'bg-gray-300' : ''}`}
                    onClick={() => onChangeDirection('col')}
                >
                    <BiListUl className="w-5 h-5 mx-auto text-[#30343E]" />
                </button>
                <button
                    type="button"
                    className={`w-8 h-8 rounded ${direction === 'row' ? 'bg-gray-300' : ''}`}
                    onClick={() => onChangeDirection('row')}
                >
                    <BiGrid className="w-5 h-5 mx-auto text-[#30343E]" />
                </button>
            </div>
        </div>
    );
};

export default ActionBar;
