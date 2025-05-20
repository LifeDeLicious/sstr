//import { formatDistanceToNow } from "date-fns";

export default function AdminUsersCollapse({ summary, sessions }) {
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["usersData"],
    queryFn: async () => {
      const response = await fetch(
        `https://api.sstr.reinis.space/admingetusers`,
        {
          credentials: "include",
          method: "GET",
        }
      );

      if (response.status === 401) {
        throw new Error("unauthorized");
      } else if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      return response.json();
    },
    enabled: !!user && !!analyticsId,
    retry: (failureCount, error) => {
      if (error.message === "private") {
        return false;
      }

      return failureCount < 3;
    },
  });

  console.log(usersData);

  return (
    <>
      <details className="collapse collapse-arrow bg-base-200 border-base-300 border mb-3">
        <summary className="collapse-title font-semibold">
          <div>
            <p className="text-lg">Manage users</p>
          </div>
        </summary>
        <div className="divider mt-0 mb-0"></div>
        <div className="collapse-content text-sm">
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>User</th>
                  <th></th>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </details>
    </>
  );
}
