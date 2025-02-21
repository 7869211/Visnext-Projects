import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { SidebarProvider } from "@/components/sidebar/Sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import SupportingGraphic from "@/assets/images/supporting-graphic.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import useUserStore from "@/store/userStore";
import { Toaster } from "sonner";

const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case "/auth":
      return "Authentication";
    case "/account":
      return "Account";
    default:
      return "ChaseLabs";
  }
};

const authRoutes = ["/auth", "/account", "/auth/create-account"];

export default function App({ Component, pageProps }: AppProps) {
  const [showBackgroundImage] = useState(false);
  const { user, isAuthenticated, fetchUserData, validateAuth } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      if (isAuthenticated) {
        if (authRoutes.includes(router.pathname) && user?.shown_onboarding) {
          router.replace("/human-intervention/jobs");
        } else if (!user?.shown_onboarding) {
          // router.replace("/home");
        }
        return;
      }
      if (!isAuthenticated && authRoutes.includes(router.pathname)) {
        return;
      }

      try {
        if (!isAuthenticated) {
          await fetchUserData();
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        router.replace("/auth");
      }
    };

    initializeAuth();
  }, [isAuthenticated, fetchUserData, validateAuth, router, user]);

  const isAuthPage = authRoutes.includes(router.pathname);

  return (
    <>
      <Head>
        <title>{`${getPageTitle(router.pathname)} | ChaseLabs`}</title>
      </Head>
      {isAuthPage ? (
        <main className="flex-1 bg-gray-100 min-h-screen">
          <Component {...pageProps} />
        </main>
      ) : router.pathname === "/oauth" ? (
        <Component {...pageProps} />
      ) : (
        <SidebarProvider>
          <div className="flex w-full bg-white">
            <AppSidebar />
            <main className="flex w-full h-full ">
              <Component {...pageProps} />
              {showBackgroundImage && (
                <div className="fixed bottom-0 right-0 z-0">
                  <Image
                    src={SupportingGraphic}
                    alt="Bottom Graphic"
                    width={347}
                    height={350}
                  />
                </div>
              )}
            </main>
          </div>
        </SidebarProvider>
      )}
      <Toaster position="top-right" />
    </>
  );
}
