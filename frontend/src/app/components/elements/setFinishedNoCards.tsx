"use client";

import React from "react";
import { Card } from "@/app/collections/[id]/base/page";

// This file contains the SetFinishedWithNoCardLeftModal component, which is used to display a modal when the user finishes studying a set and has no cards left to learn again.

const SetFinishedWithNoCardLeftModal = ({
  isOpen,
  setLoading,
  setCards,
  setCardsToLearnAgain,
  setFinished,
  setCurrentCard,
  setSetFinishedWithNoCardLeftModalOpen,
  id,
  router,
}: {
  isOpen: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  setCardsToLearnAgain: ((newCards: Card[]) => void) | null;
  setFinished: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentCard: React.Dispatch<React.SetStateAction<number | null>>;
  setSetFinishedWithNoCardLeftModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  id: string;
  router: { push: (path: string) => void };
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-black">
      <div className="bg-white p-6 rounded shadow-md w-96 flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Congratulations, Set Finished!
        </h2>
        <p className="mb-4 text-center">Do you want to study again?</p>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setLoading(true);
              setCards([]);
              if (setCardsToLearnAgain) setCardsToLearnAgain([]);
              setFinished(false);
              setCurrentCard(null);
              setSetFinishedWithNoCardLeftModalOpen(false);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
          >
            Restart
          </button>
          <button
            onClick={() => router.push(`/collections/${id}`)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetFinishedWithNoCardLeftModal;
