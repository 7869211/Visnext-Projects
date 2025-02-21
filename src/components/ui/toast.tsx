"use client";

import { ToastConfig, ToastContentProps } from "@/lib/toastUtils";
import { Check, X } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "react-toastify";

export const ToastContent = ({ message, icon, close }: ToastContentProps) => (
  <div className="flex items-center w-full h-10 px-3 py-1">
    <div
      className="flex items-center justify-center w-12 h-[66px] translate-y-[-2px] translate-x-[-26px] bg-[#E4F3E5]
     rounded-tl rounded-bl dark:text-white dark:bg-[#3D2E5B]"
    >
      {icon}
    </div>

    <div className="ml-3 flex-grow text-sm text-gray-800 font-medium dark:text-white">
      {message}
    </div>

    <button className="text-gray-500 hover:text-gray-700 ml-2" onClick={close}>
      <X className="text-b-grey-3 h-4 w-4 dark:text-white" />
    </button>
  </div>
);

export const successToast = (
  message: string,
  customStyle: Object,
  resolvedTheme: string | undefined
) => {
  toast(
    ({ closeToast }) => (
      <ToastContent
        message={message}
        icon={
          <span>
            <Check className="text-black dark:text-white" />
          </span>
        }
        close={closeToast}
      />
    ),
    {
      ...ToastConfig,
      style: {
        background: resolvedTheme === "dark" ? "#000009" : "#FFFFFF",
        border:
          resolvedTheme === "dark" ? "1px solid #292929" : "1px solid #E0DAEA",
        borderRadius: "8px",
        boxShadow: "0px 0px 9px rgba(0, 0, 0, 0.12)",
        width: "250px",
        height: "10px",
        ...customStyle,
      },
    }
  );
};

export const errorToast = (
  message: string,
  customStyle: Object,
  resolvedTheme: string | undefined
) => {
  toast(
    ({ closeToast }) => (
      <ToastContent
        message={message}
        icon={
          <span>
            <X className="text-black dark:text-white" />
          </span>
        }
        close={closeToast}
      />
    ),
    {
      ...ToastConfig,
      style: {
        background: resolvedTheme === "dark" ? "#000009" : "#FFFFFF",
        border:
          resolvedTheme === "dark" ? "1px solid #292929" : "1px solid #E0DAEA",
        borderRadius: "8px",
        boxShadow: "0px 0px 9px rgba(0, 0, 0, 0.12)",
        width: "425px",
        height: "10px",
        ...customStyle,
      },
    }
  );
};
