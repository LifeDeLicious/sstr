import { createFileRoute, useNavigate } from "@tanstack/react-router";
//import Accordion from "../components/Accordion";
import SessionsCollapse from "../components/SessionsCollapse";
import { useAuth } from "../context/AuthContext.jsx";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/sessions")({
  component: Sessions,
});

function Sessions() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const { data: sessionData, isLoading: sessionsLoading } = useQuery({
    queryKey: ["sessionSummaries", user?.UserID],
    queryFn: async () => {
      const response = await fetch(
        "https://api.sstr.reinis.space/session/summaries",
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }

      return response.json();
    },
    enabled: !!user,
  });

  if (loading || sessionsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    navigate({ to: "/" });
    return null;
  }

  return (
    <>
      <div className="flex flex-col items-center ">
        <div className="w-350">
          <h1 className="text-3xl mb-4">Recent activity</h1>
          {sessionData && sessionData.length > 0 ? (
            sessionData.map((combo, index) => (
              <SessionsCollapse
                key={`${combo.summary.car}-${combo.summary.track}-${index}`}
                summary={combo.summary}
                sessions={combo.sessions}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-lg">No session data found.</p>
              <p>Start driving to record telemetry data!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
