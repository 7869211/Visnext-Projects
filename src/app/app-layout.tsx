"use client";

import MicrosoftClarity from "@/components/clarity";
import { queryClient } from "@/lib/utils";
import { ClerkProvider, SignInButton, useAuth } from "@clerk/nextjs";
import { GoogleAnalytics } from "@next/third-parties/google";
import { QueryClientProvider } from "@tanstack/react-query";
import MainLayout from "@/components/Layout/MainLayout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn && !isRedirecting) {
      setIsRedirecting(true); // Prevents repeated redirects
    }
  }, [isLoaded, isSignedIn, isRedirecting, router]);

  if (!isLoaded || isRedirecting) {
    return <>{children}</>;
  }

  return <MainLayout>{children}</MainLayout>;
}

export function AppLayout({
  children,
  clarityProjectId,
  googleAnalyticsId,
}: Readonly<{
  children: React.ReactNode;
  googleAnalyticsId: string;
  clarityProjectId: string;
}>) {
  return (
    <ThemeProvider attribute="class">
      <ClerkProvider>
        <QueryClientProvider client={queryClient}>
          <GoogleAnalytics gaId={googleAnalyticsId} />
          <MicrosoftClarity projectId={clarityProjectId} />
          <AuthenticatedLayout>{children}</AuthenticatedLayout>
        </QueryClientProvider>
      </ClerkProvider>
    </ThemeProvider>
  );
}
