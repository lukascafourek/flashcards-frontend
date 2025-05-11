"use client";

import { copySet } from "../fetches/cardSetFetches";

// This file contains the CopyCardSetModal component, which is used to display a modal for copying a card set in the flashcard app.
// The modal includes a confirmation message and buttons to cancel or proceed with the copy action.
// The component handles the copy action and redirects to the new set page after copying.

const CopyCardSetModal = ({
  isOpen,
  router,
  setIsCopyModalOpen,
  id,
}: {
  isOpen: boolean;
  router: { push: (path: string) => void };
  setIsCopyModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}) => {
  const handleCopyCardSet = async () => {
    const response = await copySet(id);
    if (response instanceof Error) {
      alert(response.message);
    } else {
      setIsCopyModalOpen(false);
      router.push(`/collections/${response}`);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-black font-semibold mb-4">
          Are you sure you want to copy this card set? It will create a new set
          with the same cards but no images will be copied.
        </h2>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all"
            onClick={() => setIsCopyModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
            onClick={() => handleCopyCardSet()}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopyCardSetModal;
