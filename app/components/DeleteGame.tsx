import React, { useState } from "react";
import { deleteGameById } from "@/utils/api";

interface DeleteGameModalProps {
  gameId: number;
  onDeleted: () => void;
}

export default function DeleteGameModal({
  gameId,
  onDeleted,
}: DeleteGameModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    if (!loading) {
      setIsOpen(false);
      setError(null);
    }
  };

  async function handleDelete() {
    setLoading(true);
    setError(null);
    try {
      await deleteGameById(gameId);
      onDeleted();
      closeModal();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={openModal}
        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
      >
        Delete Game
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeModal}
          />

          <div className="fixed z-50 top-1/2 left-1/2 w-80 p-6 bg-white rounded shadow-lg -translate-x-1/2 -translate-y-1/2">
            <h2 className="text-lg font-semibold mb-4">Confirm deletion</h2>
            <p className="mb-4">Are you sure you want to delete this game??</p>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                disabled={loading}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
