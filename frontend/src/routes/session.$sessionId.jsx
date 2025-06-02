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
import { useState } from "react";
import { format } from "date-fns";

export const Route = createFileRoute("/session/$sessionId")({
  defaultPreload: "intent",
  component: RouteComponent,
});

function RouteComponent() {
  const { user, loading } = useAuth();
  const { sessionId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  if (loading || sessionLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    navigate({ to: "/" });
  }

  console.log("userid", user.UserID);

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteSuccess = () => {
    navigate({ to: "/sessions" });
  };

  const handleChangeAccess = async () => {
    try {
      const sessionID = sessionId;
      const isPublic = sessionData.session.isPublic;

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
              <strong>Track:</strong>{" "}
              {sessionData.session.trackName ||
                sessionData.session.trackAssetName}{" "}
              ({sessionData.session.trackLayout})
            </p>
            <p className="text-lg">
              <strong>Car:</strong>{" "}
              {sessionData.session.carName || sessionData.session.carAssetName}
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
              <strong>Date:</strong>
              {format(
                new Date(sessionData.session.dateTime),
                "MMM d, yyyy HH:mm"
              )}
            </p>
          </div>
          <div className="">
            <strong>
              Track temperature: {sessionData.session.trackTemperature} Air
              temperature: {sessionData.session.airTemperature}
            </strong>
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
          <button
            className="btn btn-outline btn-error mt-30"
            onClick={openDeleteModal}
          >
            Delete session
          </button>
        </div>
      </div>
      <DeleteSessionModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        sessionID={sessionId}
        sessionName={
          `Session from ${new Date(sessionData?.session?.dateTime).toLocaleString()}` ||
          "this session"
        }
        onDeleteSuccess={handleDeleteSuccess}
      />
    </>
  );
}

function DeleteSessionModal({
  isOpen,
  onClose,
  sessionID,
  sessionName,
  onDeleteSuccess,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleDeleteSession = async () => {
    try {
      setIsDeleting(true);
      setError(null);

      const response = await fetch(
        `https://api.sstr.reinis.space/session/delete`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionID }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete session");
      }

      onDeleteSuccess();
    } catch (error) {
      setError(error.message);
      console.error("Error deleting session:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-xl w-96 max-w-full">
        <h3 className="font-bold text-lg text-red-500 mb-4">Delete Session</h3>
        <p className="mb-6">
          Are you sure you want to delete this session? This action cannot be
          undone.
        </p>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            className="btn btn-outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="btn btn-error"
            onClick={handleDeleteSession}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Deleting...
              </>
            ) : (
              "Delete Session"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
