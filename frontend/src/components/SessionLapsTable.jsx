import { Link } from "@tanstack/react-router";
import formatLapTime from "../utils/timeFromatter.js";

const sessionsDropdown = [
  {
    event: "03.02.2024",
  },
];

export default function SessionLapsTable({ laps }) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table bg-base-200 pb-3.5">
          {/* head */}
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
                    <button className="btn h-8 join-item bg-slate-400">
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
            {/* row 1 */}
            {/* <tr className="hover:bg-base-300">
              <th>1</th>
              <td>{"1:46.35"}</td>
              <td className="w-15">
                <div className="join">
                  <button className="btn h-8 join-item bg-slate-400">
                    Analyze
                  </button>
                  <select className="select h-8 w-2 join-item">
                    <option>Copy lap ID</option>
                  </select>
                </div>
              </td>
            </tr>
            {/* row 2 */}
            {/* <tr className="hover:bg-base-300">
              <th>2</th>
              <td>abc</td>
              <td className="w-15">
                <div className="join">
                  <button className="btn h-8 join-item bg-slate-400">
                    Analyze
                  </button>
                  <details className="dropdown join-item dropdown-end">
                    <summary className="btn bg-slate-400 h-8">v</summary>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-28 p-2 shadow-sm">
                      <li>
                        <a>Copy lap ID</a>
                      </li>
                    </ul>
                  </details>
                </div>
              </td>
            </tr>
            {/* row 3 */}
            {/* <tr className="hover:bg-base-300">
              <th>3</th>
              <td>xyz</td>
            </tr> */}
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
