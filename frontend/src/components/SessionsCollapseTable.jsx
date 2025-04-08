import { Link } from "@tanstack/react-router";

const sessionsDropdown = [
  {
    event: "03.02.2024",
  },
];

export default function SessionsCollapseTable() {
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
            {/* row 1 */}
            <tr className="hover:bg-base-300">
              <th>
                <Link to={`/session/${15}`}>{"03.02.2025 16:49"}</Link>
              </th>
              <td>{25}</td>
              <td>{"1:46.35"}</td>
              <td>{"xx min xx sec"}</td>
            </tr>
            {/* row 2 */}
            <tr className="hover:bg-base-300">
              <th>2</th>
              <td>Hart Hagerty</td>
              <td>Desktop Support Technician</td>
              <td>Purple</td>
            </tr>
            {/* row 3 */}
            <tr className="hover:bg-base-300">
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
