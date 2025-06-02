import { useState, useEffect } from "react";
import formatLapTime from "../utils/timeFromatter.js";

export default function AddLapModal({
  analysisID,
  carID,
  trackID,
  isOpen,
  onClose,
  onLapAdded,
}) {
  const [bestLaps, setBestLaps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && carID && trackID) {
      fetchBestLaps();
    }
  }, [isOpen, carID, trackID]);

  const fetchBestLaps = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.sstr.reinis.space/analysis/bestlaps/${analysisID}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch best laps");
      }

      const data = await response.json();
      setBestLaps(data.bestLaps || []);
    } catch (error) {
      console.error("Error fetching best laps:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLap = async (lapID) => {
    try {
      const response = await fetch(
        `https://api.sstr.reinis.space/analysis/lap`,
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

      onLapAdded && onLapAdded(lapID);
      onClose();
    } catch (error) {
      setError(error.message);
      console.error("Error adding lap:", error);
    }
  };

  return (
    <dialog id="addLapModal" className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box w-11/12 max-w-3xl">
        <h3 className="font-bold text-lg mb-4">Add Lap to Analysis</h3>

        {isLoading ? (
          <div className="flex justify-center my-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        ) : bestLaps.length === 0 ? (
          <div className="alert alert-info mb-4">
            <span>No laps found for this car and track combination.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table bg-base-200 w-full">
              <thead>
                <tr>
                  <th className="w-15">#</th>
                  <th className="w-40">Driver</th>
                  <th className="w-24">Lap Time</th>
                  <th className="w-28">Track Conditions</th>
                  <th className="w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bestLaps.map((lap, index) => (
                  <tr key={lap.lapID} className="hover:bg-base-300">
                    <td>{index + 1}</td>
                    <td>{lap.userUsername}</td>
                    <td>{formatLapTime(lap.lapTime)}</td>
                    <td>
                      {lap.airTemperature}°C / {lap.trackTemperature}°C
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleAddLap(lap.lapID)}
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
}
