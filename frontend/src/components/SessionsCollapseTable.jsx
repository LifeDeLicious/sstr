import { Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";

const sessionsDropdown = [
  {
    event: "03.02.2024",
  },
];

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
                className="hover:bg-base-300"
                onClick={() => handleRowClick(session.sessionID)} //handleRowClick(session.sessionID)
              >
                <td>
                  <Link to={`/session/${session.sessionID}`}>
                    {format(new Date(session.date), "MMM d, yyyy HH:mm")}
                  </Link>
                </td>
                <td>{session.laps}</td>
                <td>{formatTime(session.fastestLap)}</td>
                <td>{formatTime(session.timeOnTrack)}</td>
                <td></td>
              </tr>
            ))}
            {/* row 1
            <tr className="hover:bg-base-300">
              <th>
                <Link to={`/session/${15}`}>{"03.02.2025 16:49"}</Link>
              </th>
              <td>{25}</td>
              <td>{"1:46.35"}</td>
              <td>{"xx min xx sec"}</td>
            </tr>
            {/* row 2 */}
            {/* <tr className="hover:bg-base-300">
              <th>2</th>
              <td>Hart Hagerty</td>
              <td>Desktop Support Technician</td>
              <td>Purple</td>
            </tr>
            {/* row 3 */}
            {/* <tr className="hover:bg-base-300">
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </>
  );
}

function formatTime(seconds) {
  if (!seconds) return "N/A";

  //const totalSeconds = milliseconds / 1000;
  const minutes = Math.floor(seconds / 60);
  //const seconds = Math.floor(totalSeconds % 60);
  const remainingSeconds = seconds % 60;
  const secondsInt = Math.floor(remainingSeconds);
  const milliseconds = Math.floor((remainingSeconds - secondsInt) * 1000);
  //const ms = Math.floor((milliseconds % 1000) / 10);

  return `${minutes}:${secondsInt.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
}
