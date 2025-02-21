import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
//import { appInsights } from "./instrumentation";

const isProtectedRoute = createRouteMatcher([
  "/dashboard",
  "/create",
  "/interact",
  "/invitation",
]);

export default clerkMiddleware((auth, req) => {
  //appInsights.trackTrace({ message: `Request URL: ${req.url}` });
  if (isProtectedRoute(req)) {
    //appInsights.trackTrace({
    console.log("Protected route matched, enforcing auth.");
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next|public|_not-found).*)", "/", "/(api|trpc)(.*)"],
};
