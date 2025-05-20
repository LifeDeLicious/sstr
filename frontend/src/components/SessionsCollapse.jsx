import SessionsCollapseTable from "./SessionsCollapseTable";
import { formatDistanceToNow } from "date-fns";

export default function SessionsCollapse({ summary, sessions }) {
  const formattedLastDriven = summary.lastDriven
    ? formatDistanceToNow(new Date(summary.lastDriven), { addSuffix: true })
    : "N/A";

  return (
    <>
      <details className="collapse collapse-arrow bg-base-200 border-base-300 border mb-3">
        <summary className="collapse-title font-semibold">
          <div>
            <p className="text-lg">
              {summary.carName ? summary.carName : summary.carAssetName}
            </p>
            <p className="text-lg">
              {summary.trackName} ({summary.trackLayout})
            </p>
            <p className="absolute top-3 right-100">
              Events: {summary.eventCount}
            </p>
            <p className="absolute top-3 right-40">
              Last driven: {formattedLastDriven}
            </p>
            <p className="absolute top-10 right-101">
              Laps: {summary.totalLaps}
            </p>
            <p className="absolute top-10 right-38">
              Total time on track: {summary.timeOnTrack}
            </p>
            <p className=" invisible"></p>
          </div>
        </summary>
        <div className="divider mt-0 mb-0"></div>
        <div className="collapse-content text-sm">
          <SessionsCollapseTable sessions={sessions} />
        </div>
      </details>
    </>
  );
}

function formatTime(milliseconds) {
  if (!milliseconds) return "N/A";

  const totalSeconds = milliseconds / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const ms = Math.floor((milliseconds % 1000) / 10);

  return `${minutes}:${seconds.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
}
