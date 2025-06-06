import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import AnalysisEvent from "../components/AnalysisEvent";
import { useAuth } from "./../context/AuthContext.jsx";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/analytics")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const { data: analyticsList, isLoading: analyticsListLoading } = useQuery({
    queryKey: ["analyticsList", user?.UserID],
    queryFn: async () => {
      const response = await fetch(`https://api.sstr.reinis.space/analysis`, {
        credentials: "include",
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch analytics list data");
      }

      return response.json();
    },
    enabled: !!user,
  });

  if (loading || analyticsListLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    navigate({ to: "/" });
  }
  return (
    <>
      <div className="flex flex-col items-center ">
        <div className="w-350">
          <h1 className="text-3xl mb-2.5">Analytics</h1>
          <h2 className="text-2xl mb-2.5">Recently viewed</h2>
          <AnalysisEvent analyticsList={analyticsList} />

          <br></br>
          <Outlet />
        </div>
      </div>
    </>
  );
}
