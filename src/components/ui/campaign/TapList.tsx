import React, { FC, useEffect, useState } from "react";
import Button from "../Button";
import { FaPlus } from "react-icons/fa6";
interface Tab {
    id: number;
    label: string;
    content: React.ReactNode;
}

interface TabListProps {
    tabs: Tab[];
    activeTab: number;
    setActiveTab: (id: number) => void;
    handleFileUpload: () => void;
    handleAddFAQ: () => void;
    handleAddEmail: () => void;
}

const TabList: FC<TabListProps> = ({ tabs, activeTab, setActiveTab, handleFileUpload, handleAddFAQ, handleAddEmail }) => {
    const [actionTapLabel, setActionTapLabel] = useState("");

    const handleNewItemClick = (item: string) => {
        switch (item) {
            case "Emails":
                handleAddEmail();
                break;
            case "Documents":
                handleFileUpload();
                break;
            case "FAQ":
                handleAddFAQ();
                break;
            default:
        }
    };

    useEffect(() => {
        const tab = tabs.find(tab => tab.id === activeTab);
        if (tab) {
            if (tab.label === "Email Sequence") {
                setActionTapLabel("Emails")
            } else if (tab.label === "Documents") {
                setActionTapLabel("Documents")
            } else if (tab.label === "FAQs") {
                setActionTapLabel("FAQ")
            } else {
                setActionTapLabel("")
            }
        }
    }, [activeTab, tabs])

    return (
        <div className="flex flex-col w-full">
            <div className="bg-white">
                <div className="flex justify-between items-center mx-auto w-[950px]">
                    <div>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-2 px-4 rounded-t-md ${activeTab === tab.id
                                    ? "text-[#A732A7] font-semibold border-b-4 border-[#A732A7]"
                                    : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    {actionTapLabel && (
                        <Button
                            height="24px"
                            color="Pink"
                            icon={<FaPlus className="w-3 h-3" />}
                            text={actionTapLabel}
                            textSize="xs"
                            textColor="#8C268C"
                            padding="sm"
                            onClick={() => handleNewItemClick(actionTapLabel)}
                        />
                    )}
                </div>
            </div>
            <div className="rounded-md pt-12 w-[950px] mx-auto z-30 h-full">
                {tabs.find((tab) => tab.id === activeTab)?.content}
            </div>
        </div>
    );
};

export default TabList;
