"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import AuthProvider from "@/app/context/authContext";
import LoadingSpinner from "@/app/components/loadingCircle";

const categories = [
  "MATH",
  "HISTORY",
  "GEOGRAPHY",
  "BIOLOGY",
  "CHEMISTRY",
  "PHYSICS",
  "LITERATURE",
  "ART",
  "MUSIC",
  "SPORTS",
  "MOVIES",
  "GAMES",
  "FOOD",
  "ANIMALS",
  "TECHNOLOGY",
  "CARS",
  "POLITICS",
  "RELIGION",
  "OTHER",
];

export default function CardSetPage() {
  const Render = () => {
    const { id } = useParams(); // Získání ID ze slug URL
    interface Card {
      id: string | string[];
      question: string;
      answer: string;
    }

    interface CardSet {
      id: string | string[];
      name: string;
      category: string;
      creator: string;
      createdAt: string;
      favorite: boolean;
      cards: Card[];
    }

    const [cardSet, setCardSet] = useState<CardSet | null>(null);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [favorite, setFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingSet, setEditingSet] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteWhat, setDeleteWhat] = useState("");
    const [editingCardId, setEditingCardId] = useState<string | string[]>("");
    const [viewMode, setViewMode] = useState<"flashcards" | "stats">(
      "flashcards"
    );

    useEffect(() => {
      if (!id) return;
      // Simulace načítání dat z API
      setTimeout(() => {
        setCardSet({
          id,
          name: "Example Flashcard Set",
          category: "MATH",
          creator: "John Doe",
          createdAt: "2024-03-16",
          favorite: false,
          cards: [
            { id: "1", question: "2 + 2", answer: "4" },
            { id: "2", question: "5 × 3", answer: "15" },
          ],
        });
        setLoading(false);
      }, 1000);
    }, [id]);

    const DeleteModal = ({
      isOpen,
      cardOrSet,
    }: {
      isOpen: boolean;
      cardOrSet: string;
    }) => {
      if (!isOpen) return null;
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl text-black font-semibold mb-4">
              Are you sure you want to delete this {cardOrSet}?
            </h2>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-400 transition-all"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400 transition-all"
                onClick={() => {
                  alert(`${cardOrSet} deleted (replace with API call)`);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      );
    };

    const EditCardForm = ({
      card,
      setCardSet,
      setEditingCardId,
    }: {
      card: Card;
      setCardSet: React.Dispatch<React.SetStateAction<CardSet | null>>;
      setEditingCardId: React.Dispatch<React.SetStateAction<string | string[]>>;
    }) => {
      const [question, setQuestion] = useState(card.question);
      const [answer, setAnswer] = useState(card.answer);
      return (
        <div className="p-4 border rounded-md bg-gray-50 text-black">
          <label className="block font-semibold text-gray-800">
            Question:
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-1 border rounded mb-2 font-normal resize"
              style={{
                resize: "vertical",
                overflowWrap: "break-word",
                minHeight: "50px",
              }}
            />
          </label>
          <label className="block font-semibold text-gray-800">
            Answer:
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-1 border rounded font-normal resize"
              style={{
                resize: "vertical",
                overflowWrap: "break-word",
                minHeight: "50px",
              }}
            />
          </label>
          <button
            className={`bg-green-500 text-white px-2 py-1 rounded mt-2 ${
              !question.trim() || !answer.trim() ? "" : "hover:bg-green-600"
            }`}
            disabled={!question.trim() || !answer.trim()}
            onClick={() => {
              setCardSet((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  cards: prev.cards.map((c) =>
                    c.id === card.id ? { ...c, question, answer } : c
                  ),
                };
              });
              setEditingCardId("");
              alert("Card updated (replace with API call)");
            }}
          >
            Save Changes
          </button>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 mt-2 ml-2"
            onClick={() => setEditingCardId("")}
          >
            Cancel
          </button>
        </div>
      );
    };

    if (loading) return <LoadingSpinner />;
    return (
      <div className="min-h-screen bg-gray-200 flex flex-col">
        <Header />
        <div className="flex-grow min-h-[80vh] flex items-center justify-center">
          <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
            {editingSet ? (
              <>
                <h1 className="text-2xl text-black font-bold mb-4">
                  Edit {cardSet?.name}
                </h1>
                <div className="flex items-center gap-8 mb-4">
                  <label className="text-black font-semibold gap-2 flex items-center">
                    Name
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Set New Name"
                      className="p-2 border rounded text-black font-normal"
                    />
                  </label>
                  <label
                    htmlFor="category"
                    className="text-black font-semibold gap-2 flex items-center"
                  >
                    Category
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="p-2 border rounded text-black font-normal"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex items-center gap-2 text-black font-semibold">
                    <input
                      type="checkbox"
                      checked={favorite}
                      onChange={() => setFavorite(!favorite)}
                    />
                    Add To Favorites
                  </label>
                </div>
                <button
                  className={`bg-green-500 text-white px-4 py-2 rounded ${
                    !name.trim() ? "" : "hover:bg-green-600"
                  }`}
                  disabled={!name.trim()}
                  onClick={() => {
                    setCardSet({ ...cardSet!, name: name.trim() });
                    setCardSet({ ...cardSet!, category: category.trim() });
                    setCardSet({ ...cardSet!, favorite: favorite });
                    setName("");
                    setCategory("");
                    setFavorite(false);
                    setEditingSet(false);
                    alert("Set updated (replace with API call)");
                  }}
                >
                  Save Changes
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
                  onClick={() => setEditingSet(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h1 className="text-2xl text-black font-bold mb-4">
                  {cardSet?.name}
                </h1>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      Created by: {cardSet?.creator}
                    </p>
                    <p className="text-gray-600">
                      Category: {cardSet?.category}
                    </p>
                  </div>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => {
                      setEditingSet(true);
                      setName(cardSet?.name || "");
                      setCategory(cardSet?.category || "");
                      setFavorite(cardSet?.favorite || false);
                    }}
                  >
                    Edit Set
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      Added To Favorites: {cardSet?.favorite ? "YES" : "NO"}
                    </p>
                    <p className="text-gray-600">
                      Created at: {cardSet?.createdAt}
                    </p>
                  </div>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
                    onClick={() => {
                      setIsModalOpen(true);
                      setDeleteWhat("set");
                    }}
                  >
                    Delete Set
                  </button>
                </div>
              </>
            )}
            <DeleteModal isOpen={isModalOpen} cardOrSet={deleteWhat} />
            <div className="mt-6 flex space-x-4 border-b pb-2 text-black">
              <button
                className={viewMode === "flashcards" ? "font-bold" : ""}
                onClick={() => setViewMode("flashcards")}
              >
                Flashcards
              </button>
              <span>|</span>
              <button
                className={viewMode === "stats" ? "font-bold" : ""}
                onClick={() => setViewMode("stats")}
              >
                Statistics
              </button>
            </div>
            {viewMode === "flashcards" ? (
              <>
                <div className="mt-4 space-y-3">
                  {cardSet?.cards.map((card) => (
                    <div
                      key={Array.isArray(card.id) ? card.id.join("") : card.id}
                    >
                      {editingCardId === card.id ? (
                        <EditCardForm
                          card={card}
                          setCardSet={setCardSet}
                          setEditingCardId={setEditingCardId}
                        />
                      ) : (
                        <div className="p-4 border rounded-md bg-gray-50">
                          <p className="font-semibold text-gray-800 mb-2">
                            Q: {card.question}
                          </p>
                          <p className="text-gray-700">A: {card.answer}</p>
                          <div className="flex justify-end space-x-2 mt-2">
                            <button
                              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                              onClick={() => {
                                setEditingCardId(card.id);
                              }}
                            >
                              Edit Card
                            </button>
                            <button
                              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                              onClick={() => {
                                setIsModalOpen(true);
                                setDeleteWhat("card");
                              }}
                            >
                              Delete Card
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="mt-4 text-black">
                  <h2 className="text-xl font-semibold">Statistics</h2>
                  <p>Total Cards: {cardSet?.cards.length}</p>
                  <p>Last Reviewed: 2024-03-10</p>
                  <p>Average Score: 80%</p>
                </div>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  };
  return (
    <AuthProvider>
      <Render />
    </AuthProvider>
  );
}
