import { Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import formatLapTime from "../utils/timeFromatter.js";

export default function SessionsCollapseTable({ sessions }) {
  const navigate = useNavigate();

  const handleRowClick = (sessionID) => {
    navigate({ to: `/session/${sessionID}` });
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Event</th>
              <th>Laps</th>
              <th>Fastest lap</th>
              <th>Time on track</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr
                key={session.sessionID}
                className="hover:bg-base-300 cursor-pointer"
                onClick={() => handleRowClick(session.sessionID)}
              >
                <td>
                  <Link to={`/session/${session.sessionID}`}>
                    {format(new Date(session.date), "MMM d, yyyy HH:mm")}
                  </Link>
                </td>
                <td>{session.laps}</td>
                <td>{formatLapTime(session.fastestLap)}</td>
                <td>{formatLapTime(session.timeOnTrack)}</td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function formatTime(seconds) {
  if (!seconds) return "N/A";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const secondsInt = Math.floor(remainingSeconds);
  const milliseconds = Math.floor((remainingSeconds - secondsInt) * 1000);

  return `${minutes}:${secondsInt.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
}
