import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";

export const Route = createFileRoute("/usersettings")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isChangeUsernameModalOpen, setIsChangeUsernameModalOpen] =
    useState(true);
  const [newUsername, setNewUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const response = await fetch(
        `https://api.sstr.reinis.space/usersettings`,
        {
          credentials: "include",
          method: "GET",
        }
      );

      if (response.status === 401) {
        throw new Error("unauthorized");
      } else if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      return response.json();
    },
  });

  const updateUsernameMutation = useMutation({
    mutationFn: async (newUsername) => {
      const response = await fetch(
        `https://api.sstr.reinis.space/user/changeusername`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newUsername: newUsername }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update username");
      }

      return response.json();
    },
    onSuccess: () => {
      // Refetch user data to update the UI
      queryClient.invalidateQueries({ queryKey: ["userData"] });
      // Close modal and reset states
      closeUsernameModal();
    },
    onError: (error) => {
      setUsernameError(error.message);
    },
  });

  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value);
    setUsernameError("");
  };

  const submitUsernameChange = () => {
    if (!newUsername || newUsername.trim() === "") {
      setUsernameError("Username cannot be empty");
      return;
    }
    updateUsernameMutation.mutate(newUsername);
  };

  const openUsernameModal = () => {
    setNewUsername(userData.username);
    setIsChangeUsernameModalOpen(true);
  };

  const closeUsernameModal = () => {
    setIsChangeUsernameModalOpen(false);
    setNewUsername("");
    setUsernameError("");
  };

  // Show loading state
  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    navigate({ to: "/" });
  }
  return (
    <>
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-medium mb-8">My account</h1>
        <div className="space-y-6">
          <div className="flex items-center">
            <div className="w-32 font-medium">Username</div>
            <div className="flex-1">{userData.username}</div>
            <button
              className="btn btn-outline btn-sm px-6"
              onClick={openUsernameModal}
            >
              Change
            </button>
          </div>
          <div className="flex items-center">
            <div className="w-32 font-medium">E-mail</div>
            <div className="flex-1">{userData.email}</div>
          </div>
          <div className="flex items-center">
            <div className="w-32 font-medium">Sign up date</div>
            <div className="flex-1">
              {userData.dateRegistered
                ? new Date(userData.dateRegistered)
                    .toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                    .replace(",", "")
                    .replace(" ", " ")
                : "-"}
            </div>
          </div>
          <div className="pt-4 mt-5">
            <button className="btn btn-outline btn-error btn-sm px-6">
              Delete account
            </button>
          </div>
        </div>
      </div>

      {isChangeUsernameModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Change username</h3>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">New username</span>
              </label>
              <input
                type="text"
                className={`input input-bordered w-full ${usernameError ? "input-error" : ""}`}
                value={newUsername}
                onChange={handleUsernameChange}
              />
              {usernameError && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {usernameError}
                  </span>
                </label>
              )}
            </div>

            <div className="modal-action flex justify-end mt-6">
              <button
                className="btn btn-outline btn-sm"
                onClick={closeUsernameModal}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm ml-2"
                onClick={submitUsernameChange}
                disabled={updateUsernameMutation.isPending}
              >
                {updateUsernameMutation.isPending ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  "Change"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
