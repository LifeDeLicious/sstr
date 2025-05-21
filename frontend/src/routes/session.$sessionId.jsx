import {
  createFileRoute,
  useNavigate,
  useParams,
  Link,
} from "@tanstack/react-router";
import SessionLapsTable from "../components/SessionLapsTable.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import formatLapTime from "../utils/timeFromatter.js";

export const Route = createFileRoute("/session/$sessionId")({
  // loader: async ({ params }) => {
  //   return fetchPost(params.sessionId);
  // },
  defaultPreload: "intent",
  component: RouteComponent,
});

function RouteComponent() {
  const { user, loading } = useAuth();
  const { sessionId } = Route.useParams();
  console.log("router params: ", Route.useParams());
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  //console.log(sessionId);

  const { data: sessionData, isLoading: sessionLoading } = useQuery({
    queryKey: ["sessionData", sessionId],
    queryFn: async () => {
      const response = await fetch(
        `https://api.sstr.reinis.space/session/data/${sessionId}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch session data");
      }

      return response.json();
    },
    enabled: !!user && !!sessionId,
  });

  // Show loading state
  if (loading || sessionLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    navigate({ to: "/" });
  }

  console.log("userid", user.UserID);

  const handleChangeAccess = async () => {
    try {
      const sessionID = sessionId;
      const isPublic = sessionData.session.isPublic;

      console.log(`is analysis public:${isPublic}`);

      const response = await fetch(
        `https://api.sstr.reinis.space/session/accessibility`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionID, isPublic }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to change session accessibility");
      }

      queryClient.invalidateQueries({
        queryKey: ["sessionData", sessionId],
      });
    } catch (error) {
      console.error("Error changing session accessibility:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center ">
        <div className="w-350">
          <div className="grid grid-cols-5">
            <h1 className="text-3xl mb-8 col-span-4">
              {sessionData?.session
                ? `Session - ${new Date(sessionData.session.dateTime).toLocaleString()}`
                : "Loading session..."}
            </h1>
            <div className="join">
              <button className="btn h-8 join-item bg-slate-400">
                {sessionData.session.isPublic ? "Public" : "Private"}
              </button>
              <details className="dropdown join-item dropdown-end">
                <summary className="btn bg-slate-400 h-8">v</summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-30 h-10 p-2 shadow-sm">
                  <li>
                    <a onClick={() => handleChangeAccess()}>
                      {sessionData.session.isPublic ? "Private" : "Public"}
                    </a>
                  </li>
                </ul>
              </details>
            </div>
          </div>
          <strong>Driver: {sessionData.session.userUsername}</strong>
          <div className="grid grid-cols-2">
            <p className="text-lg">
              <strong>Track:</strong> {sessionData.session.trackAssetName} (
              {sessionData.session.trackLayout})
            </p>
            <p className="text-lg">
              {/*inline relative left-105 top-[-27px]  */}
              <strong>Car:</strong> {sessionData.session.carAssetName}
            </p>
            <p className="">
              <strong>Laps:</strong> {sessionData.session.amountOfLaps}
            </p>
            <p className="">
              <strong>Fastest lap:</strong>{" "}
              {formatLapTime(sessionData.session.fastestLapTime)}
            </p>
            <p className="">
              <strong>Average lap time:</strong> {40}
            </p>
            <p className="">
              <strong>Date:</strong> {sessionData.session.dateTime}
            </p>
          </div>
          <div className="">
            <p>temperaturas</p>
          </div>
          {/* <p>lap table</p> */}
          <br></br>
          <SessionLapsTable
            key={`${sessionData.session.sessionID}-${sessionData.session.carAssetName}-${sessionData.session.trackAssetName}`}
            laps={sessionData.laps}
            userID={user.UserID}
            carID={sessionData.session.carID}
            trackID={sessionData.session.trackID}
            onAnalysisCreated={(analysisID) =>
              navigate({ to: `/analytics/${analysisID}` })
            }
          />
          {/* {sessionData && sessionData.length > 0 ? (
            <SessionLapsTable
              key={`${sessionData.session.sessionID}-${sessionData.session.carAssetName}-${sessionData.session.trackAssetName}`}
              laps={sessionData.laps}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-lg">No session laps found.</p>
              <p>Start driving to record telemetry data!</p>
            </div>
          )} */}
          {/* <SessionLapsTable /> */}
          <button className="btn btn-warning mt-30">Delete analysis</button>
        </div>
      </div>
    </>
  );
}
