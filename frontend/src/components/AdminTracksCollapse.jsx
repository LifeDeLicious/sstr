//import { formatDistanceToNow } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function AdminUsersCollapse() {
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const queryClient = useQueryClient();

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

  const tracks = tracksData?.users || [];

  //   const openDeleteUserModal = (user) => {
  //     setSelectedUser(user);
  //     setIsDeleteUserModalOpen(true);
  //   };

  //   const closeDeleteUserModal = () => {
  //     setIsDeleteUserModalOpen(false);
  //     setSelectedUser(null);
  //   };

  //   const handleDeleteUserSuccess = () => {};

  //   const handleDeleteUser = async (userID, userUsername) => {
  //     try {
  //       //console.log(`is analysis public:${isPublic}`);

  //       const response = await fetch(
  //         `https://api.sstr.reinis.space/admin/updatetrack`,
  //         {
  //           method: "POST",
  //           credentials: "include",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             deleteUserID: userID,
  //             deleteUserUsername: userUsername,
  //           }),
  //         }
  //       );

  //       if (!response.ok) {
  //         throw new Error("Failed to delete user");
  //       }

  //       queryClient.invalidateQueries({
  //         queryKey: ["tracksData"],
  //       });
  //       //closeDeleteUserModal();
  //     } catch (error) {
  //       console.error("Error deleting user:", error);
  //     }
  //   };

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
                {tracks.map((track) => (
                  <tr key={track.trackID} className="hover:bg-base-300">
                    <div>
                      <p className="text-md">
                        Asset name: {track.trackAssetName}, configuration:{" "}
                        {track.trackLayout}
                      </p>
                      <br></br>
                      <form>
                        <label>Display name:</label>
                        <input
                          type="text"
                          name="trackname"
                          placeholder={track.trackName}
                        ></input>
                        <button type="submit" className="btn btn-neutral">
                          Save
                        </button>
                      </form>
                    </div>
                    <td> </td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
