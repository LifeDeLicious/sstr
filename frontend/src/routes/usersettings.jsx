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
        <div className="flex flex-col items-center ">
          <div className="w-350">
            <h2>Username: {userData.username}</h2>
            <button className="btn btn-outline">Change</button>
            <br></br>
            <h3>Email: {userData.email}</h3>
            <h3>Sign up date: {userData.dateRegistered}</h3>
            <button className="btn btn-outline btn-error">
              Delete account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
