import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/usersettings")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const response = await fetch(
        `https://api.sstr.reinis.space/usersettings`,
        {
          credentials: "include",
          method: "GET",
        }
      );

      if (response.status === 401) {
        throw new Error("unauthorized");
      } else if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      return response.json();
    },
  });

  // Show loading state
  if (userLoading) {
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
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-medium mb-8">My account</h1>
        <div className="space-y-6">
          <div className="flex items-center">
            <div className="w-32 font-medium">Username</div>
            <div className="flex-1">{userData.username}</div>
            <button className="btn btn-outline btn-sm px-6">Change</button>
          </div>
          <div className="flex items-center">
            <div className="w-32 font-medium">E-mail</div>
            <div className="flex-1">{userData.email}</div>
          </div>
          <div className="flex items-center">
            <div className="w-32 font-medium">Sign up date</div>
            <div className="flex-1">
              {userData.dateRegistered
                ? new Date(userData.dateRegistered)
                    .toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                    .replace(",", "")
                    .replace(" ", " ")
                : "-"}
            </div>
          </div>
          <div className="pt-4">
            <button className="btn btn-outline btn-error btn-sm px-6">
              Delete account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
