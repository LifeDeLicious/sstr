//import { formatDistanceToNow } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function AdminTracksCollapse() {
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

  const tracks = tracksData?.tracks || [];

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
              {tracks.map((track) => (
                <form
                  key={track.trackID}
                  onSubmit={(e) => handleSubmit(e, track)}
                  className="flex items-center gap-4 mb-4 p-2 bg-base-300 bg-opacity-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <label className="font-semibold whitespace-nowrap">
                      Asset name:
                    </label>
                    <span className="text-md">{track.trackAssetName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="font-semibold whitespace-nowrap">
                      Display name:
                    </label>
                    <input
                      type="text"
                      value={trackNames[track.trackID] || ""}
                      onChange={(e) =>
                        handleInputChange(track.trackID, e.target.value)
                      }
                      className="input input-bordered input-sm min-w-[150px] flex-grow"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="font-semibold whitespace-nowrap">
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
              ))}
            </div>
          )}
        </div>
      </details>
    </>
  );
}
