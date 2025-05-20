//import { formatDistanceToNow } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function AdminTracksCollapse() {
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const queryClient = useQueryClient();
  const [trackNames, setTrackNames] = useState({});

  const {
    data: tracksData,
    isLoading: tracksLoading,
    error: tracksError,
  } = useQuery({
    queryKey: ["tracksData"],
    queryFn: async () => {
      const response = await fetch(
        `https://api.sstr.reinis.space/admin/gettracks`,
        {
          credentials: "include",
          method: "GET",
        }
      );

      if (response.status === 401) {
        throw new Error("unauthorized");
      } else if (!response.ok) {
        throw new Error("Failed to fetch tracks");
      }

      return response.json();
    },
    retry: (failureCount, error) => {
      if (error.message === "private") {
        return false;
      }

      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (tracksData?.tracks) {
      const initialTrackNames = {};
      tracksData.tracks.forEach((track) => {
        initialTrackNames[track.trackID] = track.trackName;
      });
      setTrackNames(initialTrackNames);
    }
  }, [tracksData]);

  console.log("tracksdata", tracksData);

  const tracks = tracksData?.users || [];

  const handleInputChange = (trackID, value) => {
    setTrackNames((prev) => ({
      ...prev,
      [trackID]: value,
    }));
  };

  const handleSubmit = async (e, track) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://api.sstr.reinis.space/admin/updatetrack`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trackID: track.trackID,
            trackName: trackNames[track.trackID],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update track");
      }

      queryClient.invalidateQueries({
        queryKey: ["tracksData"],
      });

      alert("Track updated successfully");
    } catch (error) {
      console.error("Error updating track:", error);
    }
  };

  return (
    <>
      <details className="collapse collapse-arrow bg-base-200 border-base-300 border mb-3">
        <summary className="collapse-title font-semibold">
          <div>
            <p className="text-lg">Manage tracks</p>
          </div>
        </summary>
        <div className="divider mt-0 mb-0"></div>
        <div className="collapse-content text-sm">
          {tracksLoading ? (
            <div className="flex justify-center p-4">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : tracksError ? (
            <div className="alert alert-error">
              <span>Error loading tracks: {tracksError.message}</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <tbody>
                  {tracks.map((track) => (
                    <tr key={track.trackID} className="hover:bg-base-300">
                      <td className="w-full">
                        <form
                          onSubmit={(e) => handleSubmit(e, track)}
                          className="flex items-center flex-wrap gap-4"
                        >
                          <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold">
                              Asset name:
                            </label>
                            <span className="text-md">
                              {track.trackAssetName}
                            </span>
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold">
                              Display name:
                            </label>
                            <input
                              type="text"
                              value={trackNames[track.trackID] || ""}
                              onChange={(e) =>
                                handleInputChange(track.trackID, e.target.value)
                              }
                              className="input input-bordered input-sm"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold">
                              Track configuration:
                            </label>
                            <span className="text-md">{track.trackLayout}</span>
                          </div>

                          <button
                            type="submit"
                            className="btn btn-sm btn-primary ml-auto"
                          >
                            Save
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </details>
      {/* {isDeleteUserModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg shadow-xl w-96 max-w-full">
            <h3 className="text-lg font-bold text-red-500 mb-4">Delete User</h3>
            <p className="mb-6">
              Are you sure you want to delete user: "{selectedUser.userUsername}
              "?
            </p>
            <div className="flex justify-end gap-3">
              <button className="btn btn-ghost" onClick={closeDeleteUserModal}>
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={() =>
                  handleDeleteUser(
                    selectedUser.userID,
                    selectedUser.userUsername
                  )
                }
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
}
