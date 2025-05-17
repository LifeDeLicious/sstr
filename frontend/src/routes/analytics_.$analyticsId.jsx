import {
  createFileRoute,
  useParams,
  Outlet,
  useNavigate,
  Link,
} from "@tanstack/react-router";
import AnalysisLapsTable from "../components/AnalysisLapsTable.jsx";
import AddLapModal from "../components/AddLapModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/analytics_/$analyticsId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { analyticsId } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  //console.log("analyticsid", analyticsId);

  const [laps, setLaps] = useState([]);

  useEffect(() => {
    if (analyticsData && analyticsData.laps) {
      setLaps(analyticsData.laps);
    }
  }, [analyticsData]);

  //const userName = user.Username;

  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useQuery({
    queryKey: ["analyticsData", analyticsId],
    queryFn: async () => {
      const response = await fetch(
        `https://api.sstr.reinis.space/analysis/${analyticsId}`,
        {
          credentials: "include",
          method: "GET",
        }
      );

      if (response.status === 401) {
        throw new Error("private");
      } else if (!response.ok) {
        throw new Error("Failed to fetch session data");
      }

      return response.json();
    },
    enabled: !!user && !!analyticsId,
    retry: (failureCount, error) => {
      if (error.message === "private") {
        return false;
      }
      // Retry other errors up to 3 times
      return failureCount < 3;
    },
  });

  // Show loading state
  if (loading || analyticsLoading) {
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

  if (analyticsError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="alert alert-error">
          <span>
            {analyticsError.message === "private"
              ? "This analysis is private. You don't have access to view it."
              : "Failed to load analysis data"}
          </span>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="alert alert-error">
          <span>Failed to load analysis data</span>
        </div>
      </div>
    );
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleLapAdded = () => {
    queryClient.invalidateQueries({ queryKey: ["analyticsData", analyticsId] });
  };

  const handleLapRemoved = (lapID) => {
    setLaps((prevLaps) => prevLaps.filter((lap) => lap.lapID !== lapID));
    queryClient.invalidateQueries({ queryKey: ["analyticsData", analyticsId] });
  };

  const handlePasteLap = async (analysisID) => {
    try {
      const lapID = await navigator.clipboard.readText();

      const response = await fetch(
        `https://api.sstr.reinis.space/analysis/pastelap`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ analysisID, lapID }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add lap to analysis");
      }

      handleLapAdded(lapID);
      //onLapAdded && onLapAdded(lapID);
      //handleLapAdded && handleLapAdded(lapID);
      //onClose();
    } catch (error) {
      //setError(error.message);
      console.error("Error adding lap:", error);
    }
  };

  const handleChangeAccess = async () => {
    try {
      const analysisID = analyticsId;
      const isPublic = analyticsData.isPublic;

      console.log(`is analysis public:${isPublic}`);

      const response = await fetch(
        `https://api.sstr.reinis.space/analysis/accessibility`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ analysisID, isPublic }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to change analysis accessibility");
      }

      queryClient.invalidateQueries({
        queryKey: ["analyticsData", analyticsId],
      });
    } catch (error) {
      console.error("Error changing analysis accessibility:", error);
    }
  };

  const handleLapColorChanged = (lapID, newColor) => {
    setLaps((prevLaps) =>
      prevLaps.map((lap) =>
        lap.lapID === lapID ? { ...lap, color: newColor } : lap
      )
    );

    queryClient.invalidateQueries({ queryKey: ["analyticsData", analyticsId] });
  };

  return (
    <>
      <div className="flex flex-col items-center ">
        <div className="w-350">
          <div className="grid grid-cols-5">
            <h1 className="text-3xl mb-8 col-span-4">
              {"Analysis name inside a textbox/outline"}
            </h1>
            <div className="join col-span-1">
              <button className="btn h-8 join-item bg-slate-400">
                {analyticsData.isPublic ? "Public" : "Private"}
              </button>
              <details className="dropdown join-item dropdown-end">
                <summary className="btn bg-slate-400 h-8">v</summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-30 h-10 p-2 shadow-sm">
                  <li>
                    <a onClick={() => handleChangeAccess()}>
                      {analyticsData.isPublic ? "Private" : "Public"}
                    </a>
                  </li>
                </ul>
              </details>
            </div>
          </div>
          <div className="">
            <p className="text-lg">
              <strong>Track:</strong>{" "}
              {/* {analyticsData.trackName} ({analyticsData.trackLayout}) */}
              {analyticsData.trackName && analyticsData.trackLayout
                ? `${analyticsData.trackName} (${analyticsData.trackLayout})`
                : "Loading..."}
            </p>
            <p className="text-lg">
              {/*inline relative left-105 top-[-27px]  */}
              <strong>Car:</strong>{" "}
              {analyticsData.carName ? analyticsData.carName : "Loading..."}
            </p>
          </div>
          <h2 className="text-2xl mt-3 mb-2.5">Laps</h2>
          {/* <AnalysisEvent /> */}
          {analyticsData.laps && (
            <AnalysisLapsTable
              analyticsLaps={analyticsData.laps}
              analyticsID={analyticsId}
              onLapRemoved={handleLapRemoved}
              onLapColorChanged={handleLapColorChanged}
            />
          )}
          {/* <AnalysisLapsTable analyticsLaps={analyticsData.laps} /> */}
          {/* <Accordion /> */}
          {/* <Outlet /> */}
          <br></br>
          <button className="btn btn-info" onClick={openModal}>
            Add lap
          </button>
          <button
            className="btn btn-accent"
            onClick={() => handlePasteLap(analyticsId)}
          >
            Paste lap ID
          </button>
          <br></br>
          <Link to={`/analytics/${analyticsId}/graphs`}>
            <button className="btn btn-secondary">Review</button>
          </Link>
          <br></br>
          <button className="btn btn-warning mt-30">Delete analytics</button>
        </div>
      </div>
      <AddLapModal
        analysisID={analyticsId}
        carID={analyticsData.carID}
        trackID={analyticsData.trackID}
        isOpen={isModalOpen}
        onClose={closeModal}
        onLapAdded={handleLapAdded}
      />
    </>
  );
}

<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  fill="#000000"
  version="1.1"
  id="Capa_1"
  width="800px"
  height="800px"
  viewBox="0 0 45.973 45.973"
  xml:space="preserve"
>
  <g>
    <g>
      <path d="M43.454,18.443h-2.437c-0.453-1.766-1.16-3.42-2.082-4.933l1.752-1.756c0.473-0.473,0.733-1.104,0.733-1.774    c0-0.669-0.262-1.301-0.733-1.773l-2.92-2.917c-0.947-0.948-2.602-0.947-3.545-0.001l-1.826,1.815    C30.9,6.232,29.296,5.56,27.529,5.128V2.52c0-1.383-1.105-2.52-2.488-2.52h-4.128c-1.383,0-2.471,1.137-2.471,2.52v2.607    c-1.766,0.431-3.38,1.104-4.878,1.977l-1.825-1.815c-0.946-0.948-2.602-0.947-3.551-0.001L5.27,8.205    C4.802,8.672,4.535,9.318,4.535,9.978c0,0.669,0.259,1.299,0.733,1.772l1.752,1.76c-0.921,1.513-1.629,3.167-2.081,4.933H2.501    C1.117,18.443,0,19.555,0,20.935v4.125c0,1.384,1.117,2.471,2.501,2.471h2.438c0.452,1.766,1.159,3.43,2.079,4.943l-1.752,1.763    c-0.474,0.473-0.734,1.106-0.734,1.776s0.261,1.303,0.734,1.776l2.92,2.919c0.474,0.473,1.103,0.733,1.772,0.733    s1.299-0.261,1.773-0.733l1.833-1.816c1.498,0.873,3.112,1.545,4.878,1.978v2.604c0,1.383,1.088,2.498,2.471,2.498h4.128    c1.383,0,2.488-1.115,2.488-2.498v-2.605c1.767-0.432,3.371-1.104,4.869-1.977l1.817,1.812c0.474,0.475,1.104,0.735,1.775,0.735    c0.67,0,1.301-0.261,1.774-0.733l2.92-2.917c0.473-0.472,0.732-1.103,0.734-1.772c0-0.67-0.262-1.299-0.734-1.773l-1.75-1.77    c0.92-1.514,1.627-3.179,2.08-4.943h2.438c1.383,0,2.52-1.087,2.52-2.471v-4.125C45.973,19.555,44.837,18.443,43.454,18.443z     M22.976,30.85c-4.378,0-7.928-3.517-7.928-7.852c0-4.338,3.55-7.85,7.928-7.85c4.379,0,7.931,3.512,7.931,7.85    C30.906,27.334,27.355,30.85,22.976,30.85z" />
    </g>
  </g>
</svg>;
