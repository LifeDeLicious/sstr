//import { formatDistanceToNow } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function AdminUsersCollapse() {
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const queryClient = useQueryClient();

  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["usersData"],
    queryFn: async () => {
      const response = await fetch(
        `https://api.sstr.reinis.space/admin/getusers`,
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
    retry: (failureCount, error) => {
      if (error.message === "private") {
        return false;
      }

      return failureCount < 3;
    },
  });

  const users = usersData?.users || [];

  const openDeleteUserModal = (user) => {
    setSelectedUser(user);
    setIsDeleteUserModalOpen(true);
  };

  const closeDeleteUserModal = () => {
    setIsDeleteUserModalOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUserSuccess = () => {};

  const handleDeleteUser = async (userID, userUsername) => {
    try {
      //console.log(`is analysis public:${isPublic}`);

      const response = await fetch(
        `https://api.sstr.reinis.space/admin/deleteuser`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            deleteUserID: userID,
            deleteUserUsername: userUsername,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      queryClient.invalidateQueries({
        queryKey: ["usersData"],
      });
      closeDeleteUserModal();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

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
                {users.map((user) => (
                  <tr key={user.userID} className="hover:bg-base-300">
                    <td>{user.userUsername}</td>
                    <td>
                      <button
                        className="btn btn-errror btn-outline"
                        onClick={() => openDeleteUserModal(user)}
                      >
                        Delete user
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </details>
      {isDeleteUserModalOpen && selectedUser && (
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
      )}
    </>
  );
}

// export default function DeleteUserModal({
//   isOpen,
//   onClose,
//   userUsername,
//   onDeleteSuccess,
// }) {
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [error, setError] = useState(null);

//   const handleDelete = async () => {
//     try {
//       setIsDeleting(true);
//       setError(null);

//       const response = await fetch(
//         `https://api.sstr.reinis.space/admin/deleteuser`,
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
//         queryKey: ["usersData"],
//       });

//       // Call the success callback
//       onDeleteSuccess();
//       onClose();
//     } catch (error) {
//       setError(error.message);
//       console.error("Error deleting analysis:", error);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
//       <div className="bg-base-100 p-6 rounded-lg shadow-xl w-96 max-w-full">
//         <h3 className="text-lg font-bold text-red-500 mb-4">Delete user</h3>
//         <p className="mb-6">
//           Are you sure you want to delete user:"{deleteUserUsername}"?
//         </p>

//         {error && (
//           <div className="alert alert-error mb-4">
//             <span>{error}</span>
//           </div>
//         )}

//         <div className="flex justify-end gap-3">
//           <button
//             className="btn btn-ghost"
//             onClick={onClose}
//             disabled={isDeleting}
//           >
//             Cancel
//           </button>
//           <button
//             className="btn btn-error"
//             onClick={handleDelete}
//             disabled={isDeleting}
//           >
//             {isDeleting ? (
//               <>
//                 <span className="loading loading-spinner loading-sm"></span>
//                 Deleting...
//               </>
//             ) : (
//               "Delete user"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
