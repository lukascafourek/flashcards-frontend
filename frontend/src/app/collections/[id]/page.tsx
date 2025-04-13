"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/app/components/elements/header";
import Footer from "@/app/components/elements/footer";
import AuthProvider from "@/app/context/authContext";
import { LoadingSpinner } from "@/app/components/elements/loadingCircle";
import {
  fetchSet,
  updateCardOrder,
} from "@/app/components/fetches/cardSetFetches";
import EditCardSet from "@/app/components/elements/editCardSet";
import CardModalCreate from "@/app/components/elements/cardModalCreate";
import EditCardForm from "@/app/components/elements/editCardForm";
import DeleteModal from "@/app/components/elements/deleteModal";
import CopyCardSetModal from "@/app/components/elements/copyCardSetModal";
import { useAuth } from "@/app/hooks/useAuth";

interface SetStatistics {
  setsLearned: number;
  cardsLearned: number;
  cardsToLearnAgain: number;
  baseMethodMode: number;
  multipleChoiceMode: number;
  trueFalseMode: number;
}

export interface Card {
  id: string;
  front: string;
  back: string;
  picture: string | null;
  mimeType: string | null;
}

export interface CardSet {
  id: string;
  name: string;
  category: string;
  creationDate: string;
  creator: string;
}

// This page is for displaying a card set and its cards.
// It allows the user to edit the card set, add new cards, and delete cards.
// It also shows the statistics of the card set and allows the user to play different modes with the cards.
export default function CardSetPage() {
  const Render = () => {
    const { authChecked } = useAuth();
    const { id } = useParams<{ id: string }>();
    const [categories, setCategories] = useState<string[]>([]);
    const router = useRouter();
    const [cardSet, setCardSet] = useState<CardSet | null>(null);
    const [statistics, setStatistics] = useState<SetStatistics | null>(null);
    const [cards, setCards] = useState<Card[]>([]);
    const [description, setDescription] = useState("");
    const [favorite, setFavorite] = useState(false);
    const [privacy, setPrivacy] = useState(true);
    const [loading, setLoading] = useState(cardSet === null);
    const [error, setError] = useState("");
    const [isCreator, setIsCreator] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteWhat, setDeleteWhat] = useState("");
    const [editingCardId, setEditingCardId] = useState<string>("");
    const [deletingCardId, setDeletingCardId] = useState<string>("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
    const [originalCards, setOriginalCards] = useState(cards);
    const [isReordering, setIsReordering] = useState(false);
    const [viewMode, setViewMode] = useState<"flashcards" | "stats" | "modes">(
      "flashcards"
    );

    const fetchCardSet = useCallback(async () => {
      const response = await fetchSet(id);
      if (response instanceof Error) {
        return response.message;
      } else {
        setCardSet(response.basicCardSetDto);
        setStatistics(response.setStatistics);
        setCards(response.cards);
        setDescription(response.description);
        setFavorite(response.favorite);
        setPrivacy(response.privacy);
        setIsCreator(response.creator);
        setCategories(response.categories);
        return null;
      }
    }, [id]);

    const moveCard = (index: number, direction: "up" | "down") => {
      if (
        (direction === "up" && index === 0) ||
        (direction === "down" && index === cards.length - 1)
      ) {
        return;
      }
      if (!isReordering) {
        setOriginalCards([...cards]);
        setIsReordering(true);
      }
      const newCards = [...cards];
      const temp = newCards[index];
      newCards[index] = newCards[index + (direction === "up" ? -1 : 1)];
      newCards[index + (direction === "up" ? -1 : 1)] = temp;
      setCards(newCards);
      const isSameOrder = newCards.every(
        (card, idx) => card.id === originalCards[idx]?.id
      );
      if (isSameOrder) {
        setIsReordering(false);
      }
    };

    const applyReorder = async () => {
      const response = await updateCardOrder(id, cards);
      if (response instanceof Error) {
        alert(response.message);
      } else {
        setOriginalCards(cards);
        setIsReordering(false);
      }
    };

    const cancelReorder = () => {
      setCards(originalCards);
      setIsReordering(false);
    };

    useEffect(() => {
      if (!id || id === "" || cardSet || !authChecked) return;
      fetchCardSet()
        .then((error) => setError(error || ""))
        .finally(() => setLoading(false));
    }, [cardSet, fetchCardSet, id, authChecked]);

    if (loading || !authChecked) return <LoadingSpinner />;
    return (
      <div className="min-h-screen bg-gray-200 flex flex-col md:text-xl">
        {/* Header */}
        <Header />

        {/* Main Content */}
        {error ? (
          <p className="text-red-500 text-center flex-grow">{error}</p>
        ) : (
          <>
            <div className="flex-grow flex items-center justify-center">
              <div className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-md my-8">
                {/* Card Set Edit */}
                <EditCardSet
                  cardSet={cardSet}
                  setCardSet={setCardSet}
                  setLoading={setLoading}
                  setIsModalOpen={setIsModalOpen}
                  setDeleteWhat={setDeleteWhat}
                  setIsCopyModalOpen={setIsCopyModalOpen}
                  categories={categories}
                  id={id}
                  isCreator={isCreator}
                  privacy={privacy}
                  setPrivacy={setPrivacy}
                  favorite={favorite}
                  setFavorite={setFavorite}
                  description={description}
                  setDescription={setDescription}
                />

                {/* Modals */}
                {!isCreator && (
                  <CopyCardSetModal
                    isOpen={isCopyModalOpen}
                    router={router}
                    setIsCopyModalOpen={setIsCopyModalOpen}
                    id={id}
                  />
                )}
                {isCreator && (
                  <DeleteModal
                    isOpen={isModalOpen}
                    cardOrSet={deleteWhat}
                    router={router}
                    setIsModalOpen={setIsModalOpen}
                    deletingCardId={deletingCardId}
                    setDeletingCardId={setDeletingCardId}
                    setCards={setCards}
                    id={id}
                    cardSet={cardSet}
                  />
                )}

                {/* View Mode Selection */}
                <div className="mt-6 flex space-x-4 border-b pb-2 text-black">
                  <button
                    className={viewMode === "flashcards" ? "font-bold" : ""}
                    onClick={() => setViewMode("flashcards")}
                  >
                    Flash cards
                  </button>
                  <span>|</span>
                  <button
                    className={viewMode === "stats" ? "font-bold" : ""}
                    onClick={() => setViewMode("stats")}
                  >
                    Statistics
                  </button>
                  <span>|</span>
                  <button
                    className={viewMode === "modes" ? "font-bold" : ""}
                    onClick={() => setViewMode("modes")}
                  >
                    Learning Modes
                  </button>
                </div>

                {/* View Mode Content */}
                {viewMode === "flashcards" ? (
                  <>
                    {cards.length > 0 ? (
                      <>
                        <div className="mt-4 space-y-3">
                          {cards.map((card, index) => (
                            <div
                              key={
                                Array.isArray(card.id)
                                  ? card.id.join("")
                                  : card.id
                              }
                            >
                              {isCreator && editingCardId === card.id ? (
                                <EditCardForm
                                  card={card}
                                  setEditingCardId={setEditingCardId}
                                  setCards={setCards}
                                  id={id}
                                />
                              ) : (
                                <div className="p-4 border rounded-md bg-gray-50">
                                  {card.picture && card.mimeType && (
                                    <Image
                                      src={`data:${card.mimeType};base64,${card.picture}`}
                                      alt="Card Image"
                                      className="max-w-64 max-h-64 mb-2 center mx-auto my-auto"
                                      width={500}
                                      height={500}
                                    />
                                  )}
                                  <div className="flex justify-between items-center mb-1">
                                    <p className="font-semibold text-gray-800 whitespace-pre-line">
                                      Question:{"\n"}
                                      {card.front}
                                    </p>
                                    {isCreator && (
                                      <button
                                        className="bg-gray-300 p-2 rounded-md hover:bg-gray-400"
                                        onMouseDown={() =>
                                          moveCard(index, "up")
                                        }
                                        title="Move Up"
                                      >
                                        ⬆️
                                      </button>
                                    )}
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <p className="text-gray-700 whitespace-pre-line">
                                      Answer:{"\n"}
                                      {card.back}
                                    </p>
                                    {isCreator && (
                                      <button
                                        className="bg-gray-300 p-2 rounded-md hover:bg-gray-400"
                                        onMouseDown={() =>
                                          moveCard(index, "down")
                                        }
                                        title="Move Down"
                                      >
                                        ⬇️
                                      </button>
                                    )}
                                  </div>
                                  <div className="flex justify-end space-x-2 mt-2">
                                    {isCreator && (
                                      <>
                                        <button
                                          type="button"
                                          title="Edit Card"
                                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                          onClick={() => {
                                            setEditingCardId(card.id);
                                          }}
                                        >
                                          <Image
                                            src="/edit.png"
                                            alt="Edit"
                                            width={20}
                                            height={20}
                                          />
                                        </button>
                                        <button
                                          type="button"
                                          title="Delete Card"
                                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                          onClick={() => {
                                            setDeleteWhat("card");
                                            setDeletingCardId(card.id);
                                            setIsModalOpen(true);
                                          }}
                                        >
                                          <Image
                                            src="/trash-bin.png"
                                            alt="Delete"
                                            width={20}
                                            height={20}
                                          />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-600 mt-4">
                        No cards created. Card set is empty.
                      </p>
                    )}
                  </>
                ) : viewMode === "stats" ? (
                  <>
                    <div className="mt-4 text-black">
                      <h2 className="font-semibold mb-2">Your Statistics</h2>
                      <p>Set Learned: {statistics?.setsLearned}</p>
                      <p>Cards Learned: {statistics?.cardsLearned}</p>
                      <p>
                        Cards To Learn Again: {statistics?.cardsToLearnAgain}
                      </p>
                      <p>
                        Percentage Correct:{" "}
                        {statistics && statistics?.cardsLearned > 0
                          ? (
                              100 -
                              (statistics?.cardsToLearnAgain /
                                statistics?.cardsLearned) *
                                100
                            ).toFixed(2)
                          : 0}{" "}
                        %
                      </p>
                      <p>
                        Base Method Mode Played: {statistics?.baseMethodMode}
                      </p>
                      <p>
                        Multiple Choice Mode Played:{" "}
                        {statistics?.multipleChoiceMode}
                      </p>
                      <p>
                        True Or False Mode Played: {statistics?.trueFalseMode}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-4 text-black">
                      <div className="mb-4">
                        <label className="block font-semibold">
                          Basic mode:
                        </label>
                        <p className="text-gray-600 mb-2">
                          Practice flashcards one by one to reinforce memory.
                        </p>
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                          onClick={() => {
                            if (cards.length === 0) {
                              alert("No cards created. Card set is empty.");
                              return;
                            }
                            router.push(`/collections/${id}/base`);
                          }}
                        >
                          Base Method
                        </button>
                      </div>
                      <div className="mb-4">
                        <label className="block font-semibold">
                          Multiple Choice:
                        </label>
                        <p className="text-gray-600 mb-2">
                          Test your knowledge by selecting the correct answer
                          from multiple options. You need at least 4 cards to
                          play this mode.
                        </p>
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                          onClick={() => {
                            if (cards.length === 0) {
                              alert("No cards created. Card set is empty.");
                              return;
                            }
                            router.push(`/collections/${id}/multiple`);
                          }}
                        >
                          Multiple Choice
                        </button>
                      </div>
                      <div>
                        <label className="block font-semibold">
                          True Or False:
                        </label>
                        <p className="text-gray-600 mb-2">
                          Decide whether the given statement is true or false.
                          You need at least 2 cards to play this mode.
                        </p>
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                          onClick={() => {
                            if (cards.length === 0) {
                              alert("No cards created. Card set is empty.");
                              return;
                            }
                            router.push(`/collections/${id}/true-false`);
                          }}
                        >
                          True Or False
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Floating Ordering Buttons */}
            {isReordering && (
              <div className="fixed bottom-10 md:right-40 right-32 flex space-x-6 items-center justify-center">
                <button
                  onClick={applyReorder}
                  className="md:w-24 md:h-20 md:text-xl w-16 h-12 text-base font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-all shadow-lg"
                >
                  Apply
                </button>
                <button
                  onClick={cancelReorder}
                  className="md:w-24 md:h-20 md:text-xl w-16 h-12 text-base font-semibold bg-gray-600 text-white rounded-full hover:bg-gray-500 transition-all shadow-lg"
                >
                  Revert
                </button>
              </div>
            )}

            {/* Floating Add Button with CardModalCreate */}
            {isCreator && (
              <CardModalCreate
                isOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                setCards={setCards}
                id={id}
              />
            )}
          </>
        )}

        {/* Footer */}
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
