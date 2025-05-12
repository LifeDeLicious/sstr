import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext.jsx";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    navigate({ to: "/" });
  }

  return (
    <>
      <h1 className="ml-65 text-3xl mb-8">Admin panel</h1>
      <div className="flex flex-col items-center ">
        <div className="w-350 bg-amber-400">Hello "/sessions"!</div>
      </div>
    </>
  );
}
