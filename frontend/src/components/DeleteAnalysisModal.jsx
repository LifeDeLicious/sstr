// In a new file: src/components/DeleteAnalysisModal.jsx
import { useState } from "react";

export default function DeleteAnalysisModal({
  isOpen,
  onClose,
  analysisID,
  analysisName,
  onDeleteSuccess,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);

      const response = await fetch(
        `https://api.sstr.reinis.space/analysis/delete`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ analysisID }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete analysis");
      }

      // Call the success callback
      onDeleteSuccess();
      onClose();
    } catch (error) {
      setError(error.message);
      console.error("Error deleting analysis:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-base-100 p-6 rounded-lg shadow-xl w-96 max-w-full">
        <h3 className="text-lg font-bold text-red-500 mb-4">Delete Analysis</h3>
        <p className="mb-6">
          Are you sure you want to delete "{analysisName}"? This action cannot
          be undone, and all associated lap data will be removed.
        </p>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className="btn btn-error"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Deleting...
              </>
            ) : (
              "Delete Analysis"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
