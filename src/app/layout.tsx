import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter as FontSans, Montserrat } from "next/font/google";
import { AppLayout } from "./app-layout";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Add this custom CSS to override default toast styles
const toastStyles = {
  success: {
    style: {
      background: "white",
      border: "1px solid #E5E7EB",
      borderRadius: "16px",
      padding: "16px 24px",
      color: "black",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
      width: "auto",
      minWidth: "300px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
  },
};

export const metadata: Metadata = {
  title: "Memotar",
  description: "preserve your memories; tell your stories;",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={montserrat.variable}>
      <body
        className={cn(
          "min-h-screen h-screen bg-background font-sans antialiased overflow-hidden",
          fontSans.variable
        )}
      >
        <AppLayout
          clarityProjectId={process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? ""}
          googleAnalyticsId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ?? ""}
        >
          {children}
        </AppLayout>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
          closeButton={false}
          toastStyle={toastStyles.success.style}
          closeOnClick
          pauseOnHover={false}
        />
      </body>
    </html>
  );
}
