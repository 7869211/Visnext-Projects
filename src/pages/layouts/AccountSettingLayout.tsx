import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

const AccountLayout: React.FC<LayoutProps> = ({ children }) => (
    <div className="flex flex-col items-center min-h-screen bg-[#F7F9FC] font-inter">
        <div className="flex place-items-center w-full h-[98px] text-[32px] font-bold pl-9 border-b-2 mb-32">
            ChaseLabs
        </div>

        <div className="w-[840px]">
            <main>{children}</main>
        </div>

    </div>
);

export default AccountLayout;
