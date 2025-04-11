"use client";

import { Card } from "@/app/collections/[id]/base/page";
import React, { RefObject } from "react";

// This file contains the SetFinishedWithCardsLeftModal component, which is used to display a modal when the user finishes studying a set but has cards left to learn again.

const SetFinishedWithCardsLeftModal = ({
    isOpen,
    setSetFinishedWithCardsLeftModalOpen,
    cardsToLearnAgainRef,
    setCardsToLearnAgain,
    setCurrentCard,
    setCards,
    id,
    router,
} : {
    isOpen: boolean;
    setSetFinishedWithCardsLeftModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    cardsToLearnAgainRef: RefObject<Card[]>;
    setCardsToLearnAgain: (newCards: Card[]) => void;
    setCurrentCard: React.Dispatch<React.SetStateAction<number | null>>;
    setCards: React.Dispatch<React.SetStateAction<Card[]>>;
    id: string;
    router: { push: (path: string) => void };
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-black">
      <div className="bg-white p-6 rounded shadow-md w-96 flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Original Set Finished!
        </h2>
        <p className="mb-4 text-center">
          You have {cardsToLearnAgainRef.current.length} cards to learn again.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setCards(
                cardsToLearnAgainRef.current.map((card) => ({
                  ...card,
                  studied: null,
                }))
              );
              setCardsToLearnAgain([]);
              setSetFinishedWithCardsLeftModalOpen(false);
              setCurrentCard(1);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Keep Learning
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

export default SetFinishedWithCardsLeftModal;
