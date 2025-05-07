import { createFileRoute } from "@tanstack/react-router";
import Accordion from "../components/Accordion";
import SessionsCollapse from "../components/SessionsCollapse";
import { useAuth } from "../context/AuthContext.jsx";

export const Route = createFileRoute("/sessions")({
  component: Sessions,
});

const sessionsOverview = [
  {
    car: "Porsche 911 GT3 R (992)",
    track: "Algarve International Circuit (Grand Prix)",
    amountOfEvents: 1,
    totalLaps: 25,
    lastDriven: "03.02.2025",
    totalTrackTime: 5600,
  },
];

function Sessions() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    window.location.href = "/";
    return null;
  }

  return (
    <>
      {/* <h1 className="ml-65 text-3xl mb-8">Recent activity</h1> */}
      <div className="flex flex-col items-center ">
        <div className="w-350">
          <h1 className="text-3xl mb-4">Recent activity</h1>
          <p>Hello "/sessions"!</p>
          {/* <Accordion /> */}
          <SessionsCollapse />
        </div>
      </div>
    </>
  );
}
