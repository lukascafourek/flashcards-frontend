"use client";

import { useState } from "react";
import CardEdit from "./cardEdit";
import { createCard } from "../fetches/cardFetches";
import { Card } from "@/app/collections/[id]/page";

// This file contains the CardModalCreate component, which is used to create a new card in the flashcard app.
// It includes a modal with a form for entering the question and answer, as well as an image upload feature.
// The component also handles the creation of the card and updates the card list in the parent component.

const CardModalCreate = ({
  isOpen,
  setIsCreateModalOpen,
  setCards,
  id,
}: {
  isOpen: boolean;
  setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  id: string;
}) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);

  const handleCreateCard = async (
    question: string,
    answer: string,
    picture: string | null,
    mimeType: string | null
  ) => {
    const response = await createCard(question, answer, id, picture);
    if (response instanceof Error) {
      alert(response.message);
    } else {
      const newCard: Card = {
        id: response,
        front: question,
        back: answer,
        picture: picture,
        mimeType: mimeType,
      };
      setCards((prev) => {
        if (!prev) return prev;
        return [...prev, newCard];
      });
      setIsCreateModalOpen(false);
    }
  };

  return (
    <>
      <button
        className="md:w-24 md:h-20 md:text-xl w-16 h-12 text-base font-semibold fixed bottom-10 right-10 bg-green-600 text-white p-5 rounded-full shadow-lg hover:bg-green-500 transition-all flex items-center justify-center"
        onClick={() => setIsCreateModalOpen(true)}
      >
        Add
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-black">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Create a New Card</h2>
            <CardEdit
              question={question}
              setQuestion={setQuestion}
              answer={answer}
              setAnswer={setAnswer}
              image={image}
              setImage={setImage}
              mimeType={mimeType}
              setMimeType={setMimeType}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-400 transition-all"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setQuestion("");
                  setAnswer("");
                  setImage(null);
                  setMimeType(null);
                }}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 bg-green-600 text-white rounded-md transition-all ${
                  !question.trim() || !answer.trim() ? "" : "hover:bg-green-500"
                }`}
                disabled={!question.trim() || !answer.trim()}
                onClick={() =>
                  handleCreateCard(question, answer, image, mimeType)
                }
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CardModalCreate;
