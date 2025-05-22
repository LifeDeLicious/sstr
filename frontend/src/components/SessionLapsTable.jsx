import { Link } from "@tanstack/react-router";
import formatLapTime from "../utils/timeFromatter.js";
import { useMutation } from "@tanstack/react-query";

const sessionsDropdown = [
  {
    event: "03.02.2024",
  },
];

export default function SessionLapsTable({
  laps,
  userID,
  carID,
  trackID,
  onAnalysisCreated,
}) {
  console.log("session laps table received props:", {
    laps,
    userID,
    carID,
    trackID,
  });
  console.log("session laps table, userID:", userID);
  const analyzeMutation = useMutation({
    mutationFn: async (lapID) => {
      const res = await fetch("https://api.sstr.reinis.space/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID,
          carID,
          trackID,
          lapID,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to create analysis");
      }

      return res.json();
    },

    onSuccess: (data) => {
      onAnalysisCreated(data.analysisID);
    },
  });

  const handleAnalyze = (lapID) => {
    analyzeMutation.mutate(lapID);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table bg-base-200 mb-10">
          <thead>
            <tr>
              <th className=" w-140">Lap</th>
              <th className="ml-90 self-center">Lap time</th>
              <th className="hover:bg-yellow-100"></th>
            </tr>
          </thead>
          <tbody>
            {laps.map((lap, index) => (
              <tr
                key={lap.lapID}
                className={
                  lap.isFastestLap
                    ? "bg-violet-500 hover:bg-violet-700"
                    : "hover:bg-base-300"
                }
              >
                <td>{index + 1}</td>
                <td>{formatLapTime(lap.lapTime)}</td>
                <td className="w-15">
                  <div className="join">
                    <button
                      className="btn h-8 join-item bg-slate-400"
                      onClick={() => handleAnalyze(lap.lapID)}
                      disabled={analyzeMutation.isPending}
                    >
                      Analyze
                    </button>
                    <details className="dropdown join-item dropdown-end">
                      <summary
                        className="btn bg-slate-400 h-8"
                        popoverTarget={`popover-${index + 1}`}
                        style={{ anchorName: `--anchor-${index + 1}` }}
                      >
                        v
                      </summary>
                      <ul
                        className="menu dropdown-content bg-base-100 rounded-box z-1 w-28 p-2 shadow-sm"
                        id={`popover-${index + 1}`}
                        style={{ anchorName: `--anchor-${index + 1}` }}
                      >
                        <li>
                          <a
                            className="p-0"
                            onClick={() => copyLapID(lap.lapID)}
                          >
                            Copy lap ID
                          </a>
                        </li>
                      </ul>
                    </details>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function copyLapID(lapID) {
  navigator.clipboard.writeText(lapID);
  alert("Copied lap ID");
}
