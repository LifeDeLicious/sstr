import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext.jsx";
import AdminUsersCollapse from "../components/AdminUsersCollapse.jsx";
import AdminTracksCollapse from "../components/AdminTracksCollapse.jsx";
import AdminCarsCollapse from "../components/AdminCarsCollapse.jsx";

export const Route = createFileRoute("/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    navigate({ to: "/" });
  } else if (!user.IsAdmin) {
    navigate({ to: "/sessions" });
  }

  return (
    <>
      <h1 className="ml-65 text-3xl mb-8">Admin panel</h1>
      <div className="flex flex-col items-center ">
        <div className="w-350">
          <AdminUsersCollapse />
          <AdminTracksCollapse />
          <AdminCarsCollapse />
        </div>
      </div>
    </>
  );
}
