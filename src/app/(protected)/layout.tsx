import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in"); // TBD: Update the path to sign up page here!!
  }

  return <>{children}</>;
}
