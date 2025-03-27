"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import AuthProvider from "@/app/context/authContext";
import { LoadingSpinner } from "@/app/components/loadingCircle";
import CardEdit from "@/app/components/cardEdit";
import {
  deleteSet,
  fetchSet,
  updateSet,
} from "@/app/components/cardSetFetches";
import {
  createCard,
  deleteCard,
  updateCard,
} from "@/app/components/cardFetches";

interface SetStatistics {
  setsLearned: number;
  cardsLearned: number;
  cardsToLearnAgain: number;
  baseMethodMode: number;
  multipleChoiceMode: number;
  connectionMode: number;
}

interface Card {
  id: string;
  front: string;
  back: string;
  picture: string | null;
  mimeType: string | null;
}

interface CardSet {
  id: string;
  name: string;
  category: string;
  creationDate: string;
  creator: string;
}

export default function CardSetPage() {
  const Render = () => {
    const { id } = useParams<{ id: string }>();
    const [categories, setCategories] = useState<string[]>([]);
    const router = useRouter();
    const [cardSet, setCardSet] = useState<CardSet | null>(null);
    const [statistics, setStatistics] = useState<SetStatistics | null>(null);
    const [cards, setCards] = useState<Card[]>([]);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [favorite, setFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isCreator, setIsCreator] = useState(false);
    const [editingSet, setEditingSet] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteWhat, setDeleteWhat] = useState("");
    const [editingCardId, setEditingCardId] = useState<string>("");
    const [deletingCardId, setDeletingCardId] = useState<string>("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"flashcards" | "stats">(
      "flashcards"
    );

    const fetchCardSet = async () => {
      const response = await fetchSet(id);
      if (response instanceof Error) {
        return response.message;
      } else {
        setCardSet(response.basicCardSetDto);
        setStatistics(response.setStatistics);
        setCards(response.cards);
        setFavorite(response.favorite);
        setIsCreator(response.creator);
        setCategories(response.categories);
        return null;
      }
    };

    const handleUpdateSet = async () => {
      const response = await updateSet(id, name, category, favorite);
      if (response instanceof Error) {
        alert(response.message);
      } else {
        setCardSet({ ...cardSet!, name: name.trim() });
        setCardSet({ ...cardSet!, category: category.trim() });
        setName("");
        setCategory("");
        setEditingSet(false);
      }
    };

    const handleDeleteSet = async () => {
      const response = await deleteSet(id);
      if (response instanceof Error) {
        alert(response.message);
      } else {
        setIsModalOpen(false);
        router.push("/collections");
      }
    };

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
          id: response.id,
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
      }
    };

    const handleUpdateFavorite = async () => {
      const response = await updateSet(id, "", "", favorite);
      if (response instanceof Error) {
        alert(response.message);
      }
    };

    useEffect(() => {
      if (!id || cardSet) return;
      fetchCardSet()
        .then((error) => setError(error || ""))
        .finally(() => setLoading(false));
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        handleUpdateFavorite();
        event.preventDefault();
      };
      const handleRouteChange = () => {
        handleUpdateFavorite();
      };
      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("popstate", handleRouteChange);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("popstate", handleRouteChange);
      };
    });

    const CreateCardModal = ({ isOpen }: { isOpen: boolean }) => {
      const [question, setQuestion] = useState("");
      const [answer, setAnswer] = useState("");
      const [image, setImage] = useState<string | null>(null);
      const [mimeType, setMimeType] = useState<string | null>(null);
      if (!isOpen) return null;
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl text-black font-semibold mb-4">
              Create a New Card
            </h2>
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
                onClick={() => setIsCreateModalOpen(false)}
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
      );
    };

    const EditCardForm = ({
      card,
      setEditingCardId,
    }: {
      card: Card;
      setEditingCardId: React.Dispatch<React.SetStateAction<string>>;
    }) => {
      const [question, setQuestion] = useState(card.front);
      const [answer, setAnswer] = useState(card.back);
      const [image, setImage] = useState<string | null>(card.picture || null);
      const [mimeType, setMimeType] = useState<string | null>(
        card.mimeType || null
      );

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
            className={`bg-green-500 text-white px-4 py-2 rounded-md mt-2 ${
              !question.trim() || !answer.trim() ? "" : "hover:bg-green-600"
            }`}
            disabled={!question.trim() || !answer.trim()}
            onClick={() =>
              handleUpdateCard(card.id, question, answer, image, mimeType)
            }
          >
            Save Changes
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mt-2 ml-2"
            onClick={() => setEditingCardId("")}
          >
            Cancel
          </button>
        </div>
      );
    };

    const DeleteModal = ({
      isOpen,
      cardOrSet,
      id,
    }: {
      isOpen: boolean;
      cardOrSet: string;
      id: string;
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
                  if (id === cardSet?.id) {
                    handleDeleteSet();
                  } else if (id === deletingCardId) {
                    handleDeleteCard(id);
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

    if (loading) return <LoadingSpinner />;
    return (
      <div className="min-h-screen bg-gray-200 flex flex-col">
        <Header />
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <>
            <div className="flex-grow min-h-[80vh] flex items-center justify-center">
              <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
                {isCreator && editingSet ? (
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
                    </div>
                    <button
                      className={`bg-green-500 text-white px-4 py-2 rounded-md ${
                        !name.trim() ? "" : "hover:bg-green-600"
                      }`}
                      disabled={!name.trim()}
                      onClick={() => handleUpdateSet()}
                    >
                      Save Changes
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-2"
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
                    <div className="border-t-2 border-gray-300 w-full my-4"></div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          Created by: {cardSet?.creator}
                        </p>
                        <p className="text-gray-600">
                          Category: {cardSet?.category}
                        </p>
                      </div>
                      {isCreator && (
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                          onClick={() => {
                            setEditingSet(true);
                            setName(cardSet?.name || "");
                            setCategory(cardSet?.category || "");
                          }}
                        >
                          Edit Set
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="space-y-2">
                        <label className="text-gray-600">
                          Add To Favorites:
                          <input
                            type="checkbox"
                            className="ml-4"
                            checked={favorite}
                            onChange={() => setFavorite(!favorite)}
                          />
                        </label>
                        <p className="text-gray-600">
                          Created at: {cardSet?.creationDate}
                        </p>
                      </div>
                      {isCreator && (
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-2"
                          onClick={() => {
                            setIsModalOpen(true);
                            setDeleteWhat("set");
                          }}
                        >
                          Delete Set
                        </button>
                      )}
                    </div>
                  </>
                )}
                {isCreator && (
                  <DeleteModal
                    isOpen={isModalOpen}
                    cardOrSet={deleteWhat}
                    id={deletingCardId}
                  />
                )}
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
                    {cards.length > 0 ? (
                      <>
                        <div className="mt-4 space-y-3">
                          {cards.map((card) => (
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
                                />
                              ) : (
                                <div className="p-4 border rounded-md bg-gray-50">
                                  <p className="font-semibold text-gray-800 mb-2">
                                    Q: {card.front}
                                  </p>
                                  <p className="text-gray-700">
                                    A: {card.back}
                                  </p>
                                  <div className="flex justify-end space-x-2 mt-2">
                                    {isCreator && (
                                      <>
                                        <button
                                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                          onClick={() => {
                                            setEditingCardId(card.id);
                                          }}
                                        >
                                          Edit Card
                                        </button>
                                        <button
                                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                          onClick={() => {
                                            setIsModalOpen(true);
                                            setDeleteWhat("card");
                                            setDeletingCardId(card.id);
                                          }}
                                        >
                                          Delete Card
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
                      <p className="text-black mt-4">
                        No cards created. Card set is empty.
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <div className="mt-4 text-black">
                      <h2 className="text-xl font-semibold">Your Statistics</h2>
                      <p>Set learned: {statistics?.setsLearned}</p>
                      <p>Cards learned: {statistics?.cardsLearned}</p>
                      <p>
                        Cards to learn again: {statistics?.cardsToLearnAgain}
                      </p>
                      <p>
                        Percentage correct:{" "}
                        {statistics && statistics?.cardsLearned > 0
                          ? 100 -
                            (statistics?.cardsToLearnAgain /
                              statistics?.cardsLearned) *
                              100
                          : 0}{" "}
                        %
                      </p>
                      <p>
                        Base Method Mode played: {statistics?.baseMethodMode}
                      </p>
                      <p>
                        Multiple Choice Mode played:{" "}
                        {statistics?.multipleChoiceMode}
                      </p>
                      <p>
                        Connection Mode played: {statistics?.connectionMode}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
            {isCreator && (
              <>
                <button
                  className="fixed bottom-10 right-10 bg-green-600 text-white p-5 rounded-full shadow-lg text-2xl hover:bg-green-500 transition-all w-16 h-16 flex items-center justify-center"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  +
                </button>
                <CreateCardModal isOpen={isCreateModalOpen} />
              </>
            )}
          </>
        )}
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
