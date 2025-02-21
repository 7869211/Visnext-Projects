export const ToastConfig = {
  position: "top-center" as const,
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
};

export interface ToastContentProps {
  message: string;
  icon: React.ReactNode;
  close?: () => void;
}

export const SuccessSecondToastStyle = (resolvedTheme: string | undefined) => ({
  color: resolvedTheme === "dark" ? "#FFFFFF" : "#DC2626",
  fontFamily: "var(--font-montserrat)",
  width: "300px !important",
  padding: "0px",
  letterSpacing: "0.02em",
  fontWeight: "400",
});

export const ErrorSecondToastStyle = (resolvedTheme: string | undefined) => ({
  border:
    resolvedTheme === "dark"
      ? "1px solid #292929 !important"
      : "1px solid #FCA5A5 !important",
  color: resolvedTheme === "dark" ? "#FFFFFF" : "#DC2626",
  width: "300px",
  padding: "0px",
  fontFamily: "var(--font-montserrat)",
  letterSpacing: "0.02em",
  fontWeight: "400",
});
