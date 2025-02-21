import React from 'react';
import DataItem from '@/components/ui/campaign/DataItem';

interface DataListProps {
    tooltip?: boolean
    items: {
        isNew?: boolean | undefined;
        id: number;
        filename?: string;
        question?: string;
        description?: string;
        answer?: string;
        size?: string;
        campaign: string;
    }[];
    selectedDocs: Set<number>;
    onToggleSelect: (index: number) => void;
    direction?: 'row' | 'col';
    onSave?: (id: number, updatedDescription: string, title?: string) => void;
    onDelete?: (id: number) => void;
    border?: boolean
    height?: string
    type?: string
}

const DataList: React.FC<DataListProps> = ({ tooltip = true, items, selectedDocs, onToggleSelect, direction = 'row', onSave, onDelete, border = true, height, type = "doc" }) => {
    const isColDirection = direction == 'col';

    return (
        <div className={`w-full ${isColDirection ? 'flex flex-col space-y-4' : 'grid grid-cols-3 gap-4'}`}>
            {items.map((doc, index) => (
                <DataItem
                    key={index}
                    tooltips={tooltip}
                    title={type == "doc" ? doc.filename || "" : doc.question || ""}
                    description={doc?.description ? doc.description || "" : doc.answer || "" }
                    size={doc.size}
                    campaign={doc.campaign}
                    isSelected={selectedDocs.has(doc.id)}
                    onToggleSelect={() => onToggleSelect(doc.id)}
                    onSave={(updatedDescription, updatedTitle) => onSave?.(doc.id, updatedDescription || "", updatedTitle)}
                    onDelete={() => onDelete?.(doc.id)}
                    height={isColDirection ? '100px' : height ? height : '200px'}
                    border={border}
                    type={type}
                    isNew={doc.isNew}
                />
            ))}
        </div>
    );
};

export default DataList;
