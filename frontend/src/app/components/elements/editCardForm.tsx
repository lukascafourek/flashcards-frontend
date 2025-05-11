"use client";

import { useState } from "react";
import { Card } from "@/app/collections/[id]/page";
import CardEdit from "./cardEdit";
import { updateCard } from "../fetches/cardFetches";

// This file contains the EditCardForm component, which is used to edit a card in the flashcard app.
// The form includes fields for the question, answer, and image upload, as well as buttons to save changes or cancel the edit.
// The component handles the update action and updates the card list in the parent component.

const EditCardForm = ({
  card,
  setEditingCardId,
  setCards,
  id,
}: {
  card: Card;
  setEditingCardId: React.Dispatch<React.SetStateAction<string>>;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  id: string;
}) => {
  const [question, setQuestion] = useState(card.front);
  const [answer, setAnswer] = useState(card.back);
  const [image, setImage] = useState<string | null>(card.picture || null);
  const [mimeType, setMimeType] = useState<string | null>(
    card.mimeType || null
  );

  const handleUpdateCard = async (
    cardId: string,
    question: string,
    answer: string,
    image: string | null,
    mimeType: string | null
  ) => {
    const response = await updateCard(id, cardId, question, answer, image);
    if (response instanceof Error) {
      alert(response.message);
    } else {
      setCards((prev) => {
        if (!prev) return prev;
        return prev.map((card) => {
          if (card.id === cardId) {
            return {
              ...card,
              front: question,
              back: answer,
              picture: image,
              mimeType: mimeType,
            };
          }
          return card;
        });
      });
      setEditingCardId("");
    }
  };

  return (
    <div className="p-4 border rounded-md bg-gray-50 text-black">
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
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-md ml-2 mt-2 enabled:hover:bg-green-600"
        disabled={!question.trim() || !answer.trim()}
        onClick={() =>
          handleUpdateCard(card.id, question, answer, image, mimeType)
        }
      >
        Save Changes
      </button>
      <button
        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 ml-2 mt-2"
        onClick={() => setEditingCardId("")}
      >
        Cancel
      </button>
    </div>
  );
};

export default EditCardForm;
