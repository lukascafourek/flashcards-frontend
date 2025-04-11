"use client";

import { deleteSet } from "../fetches/cardSetFetches";
import { deleteCard } from "../fetches/cardFetches";
import { CardSet, Card } from "@/app/collections/[id]/page";

// This file contains the DeleteModal component, which is used to display a modal for deleting a card or card set in the flashcard app.
// The modal includes a confirmation message and buttons to cancel or proceed with the delete action.
// The component handles the delete action and updates the card list or redirects to the collections page after deletion.

const DeleteModal = ({
  isOpen,
  cardOrSet,
  router,
  setIsModalOpen,
  deletingCardId,
  setDeletingCardId,
  setCards,
  id,
  cardSet,
}: {
  isOpen: boolean;
  cardOrSet: string;
  router: { push: (path: string) => void };
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deletingCardId: string;
  setDeletingCardId: React.Dispatch<React.SetStateAction<string>>;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  id: string;
  cardSet: CardSet | null;
}) => {
  const handleDeleteSet = async () => {
    const response = await deleteSet(id);
    if (response instanceof Error) {
      alert(response.message);
    } else {
      setIsModalOpen(false);
      router.push("/collections");
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    const response = await deleteCard(id, cardId);
    if (response instanceof Error) {
      alert(response.message);
    } else {
      setCards((prev) => {
        if (!prev) return prev;
        return prev.filter((card) => card.id !== cardId);
      });
      setDeletingCardId("");
      setIsModalOpen(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-black font-semibold mb-4">
          Are you sure you want to delete this {cardOrSet}?
        </h2>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-400 transition-all"
            onClick={() => {
              setIsModalOpen(false);
              setDeletingCardId("");
            }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400 transition-all"
            onClick={() => {
              if (deletingCardId !== "" && cardOrSet === "card") {
                handleDeleteCard(deletingCardId);
              } else if (id === cardSet?.id && cardOrSet === "set") {
                handleDeleteSet();
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
