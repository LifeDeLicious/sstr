import { createFileRoute, useParams } from "@tanstack/react-router";
import SessionLapsTable from "../components/SessionLapsTable.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/session/$sessionID")({
  // loader: async ({ params }) => {
  //   return fetchPost(params.sessionId);
  // },
  defaultPreload: "intent",
  component: RouteComponent,
});

function RouteComponent() {
  const { user, loading } = useAuth();
  const { sessionID } = Route.useParams();
  console.log(sessionID);

  const { data: sessionData, isLoading: sessionLoading } = useQuery({
    queryKey: ["sessionData", sessionID],
    queryFn: async () => {
      const response = await fetch(
        `https://api.sstr.reinis.space/session/data/${sessionID}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch session data");
      }

      return response.json();
    },
    enabled: !!user && !!sessionID,
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
    return <Navigate to="/" />;
  }
  //const params = useParams();
  //console.log(params);

  //const { sessionId } = params || {};

  return (
    <>
      <div className="flex flex-col items-center ">
        <div className="w-350">
          <div className="grid grid-cols-5">
            <h1 className="text-3xl mb-8 col-span-4">
              {"Session 'name' - 03.02.2025 16:49"}
            </h1>
            <div className="join">
              <button className="btn h-8 join-item bg-slate-400">
                {"Private"}
                {/*state ispublic? */}
              </button>
              <details className="dropdown join-item dropdown-end">
                <summary className="btn bg-slate-400 h-8">v</summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-30 h-10 p-2 shadow-sm">
                  <li>
                    <a>
                      {"Public"}
                      {/*state opposite of ispublic */}
                    </a>
                  </li>
                </ul>
              </details>
              dropdowns neaizveras pats
            </div>
          </div>
          {/* <p>Hello "/sessions"!</p> */}
          <div className="grid grid-cols-2">
            <p className="text-lg">
              <strong>Track:</strong>{" "}
              {"Algarve International Circuit (Grand Prix)"}
            </p>
            <p className="text-lg">
              {/*inline relative left-105 top-[-27px]  */}
              <strong>Car:</strong> {sessionData.session.carAssetName}
            </p>
            <p className="">
              <strong>Laps:</strong> {5}
            </p>
            <p className="">
              <strong>Fastest lap:</strong> {"2 months"}
            </p>
            <p className="">
              <strong>Average lap time:</strong> {40}
            </p>
            <p className="">
              <strong>Date:</strong> {53}
            </p>
          </div>
          <div className="">
            <p>temperaturas</p>
          </div>
          {/* <p>lap table</p> */}
          <br></br>
          <SessionLapsTable />
        </div>
      </div>
    </>
  );
}
