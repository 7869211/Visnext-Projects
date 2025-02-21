import { useRouter } from "next/router";
import { useEffect } from "react";
import useUserStore from "@/store/userStore";  // import the store to manage user data

export default function OAuthCallback() {
  const router = useRouter();
  const { fetchUserData } = useUserStore();

  useEffect(() => {
    const handleAuthentication = async () => {
      try {
        const { refresh_token, access_token, token_type } = router.query;

        if (!refresh_token || !access_token || !token_type) {
          console.error("Missing tokens in URL");
          router.replace("/auth");
          return;
        }

        localStorage.setItem("refreshToken", refresh_token as string);
        localStorage.setItem("accessToken", access_token as string);

        await fetchUserData();

        router.replace("/auth/create-account");
      } catch (error) {
        console.error("Error handling authentication:", error);
        router.replace("/auth");
      }
    };

    if (router.isReady) {
      handleAuthentication();
    }
  }, [router, fetchUserData]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-[#858b9b]">Processing authentication, please wait...</p>
    </div>
  );
}
