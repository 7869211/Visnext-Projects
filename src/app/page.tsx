import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

const Home = async () => {
  const { userId } = await auth()

  if (userId) {
      // If the user is signed in, redirect to the Dashboard
      redirect("/dashboard");
  }

  redirect("/landing/index.html");

};

export default Home;
