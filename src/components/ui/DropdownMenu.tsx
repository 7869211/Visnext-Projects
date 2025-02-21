import React, { ReactNode } from "react";

interface DropdownMenuProps {
  children: ReactNode;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  return <div className="relative inline-block text-left">{children}</div>;
};

interface DropdownMenuTriggerProps {
  children: ReactNode;
  onClick?: () => void;
}

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  children,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer focus:outline-none"
      aria-haspopup="true"
      aria-expanded="true"
    >
      {children}
    </button>
  );
};

interface DropdownMenuContentProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Content */}
      <div
        className="absolute right-0 z-20 mt-2 w-56 origin-top-right  rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
      >
        <div className="py-1">{children}</div>
      </div>

      {/* Overlay for click outside to close */}
      <div
        className="fixed inset-0 z-0"
        onClick={onClose}
        aria-hidden="true"
      ></div>
    </>
  );
};

interface DropdownMenuItemProps {
  children: ReactNode;
  onClick?: () => void;
}

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  children,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 focus:outline-none text-[#575D6D] "
      role="menuitem"
    >
      {children}
    </button>
  );
};
