"use client";

import { useEffect, useState, useRef } from "react";
import Header from "@/app/components/elements/header";
import AuthProvider from "@/app/context/authContext";
import Footer from "@/app/components/elements/footer";
import { useParams, useRouter } from "next/navigation";
import { incrementStats } from "@/app/components/fetches/statisticsFetches";
import SetFinishedWithCardsLeftModal from "@/app/components/elements/setFinishedCardsLeft";
import SetFinishedWithNoCardLeftModal from "@/app/components/elements/setFinishedNoCards";
import { useFetchCards } from "@/app/hooks/useFetchCards";
import {
  BackToTheCardSetButton,
  QuestionAtTheStart,
  QuestionOrAnswerBaseMethod,
  SiteInaccessible,
  TopButtonsBaseMethod,
} from "@/app/components/elements/similarModeElements";

export interface Card {
  id: string;
  front: string;
  back: string;
  picture: string | null;
  mimeType: string | null;
  studied: boolean | null;
}

// This component is the main page for the Base Method learning mode of the application.
// It allows the user to study cards in a set, marking them as known or unknown.
export default function BaseMethod() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const cardsToLearnAgainRef = useRef<Card[]>([]);
  const setCardsToLearnAgain = (newCards: Card[]) => {
    cardsToLearnAgainRef.current = newCards;
  };
  const [loading, setLoading] = useState(cards.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [
    setFinishedWithCardsLeftModalOpen,
    setSetFinishedWithCardsLeftModalOpen,
  ] = useState(false);
  const [
    setFinishedWithNoCardLeftModalOpen,
    setSetFinishedWithNoCardLeftModalOpen,
  ] = useState(false);
  const [currentCard, setCurrentCard] = useState<number | null>(null);

  const fetchCards = useFetchCards();

  useEffect(() => {
    if (cards.length === 0) {
      fetchCards(id, setCards)
        .then((error) => setError(error || ""))
        .finally(() => setLoading(false));
    }
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [cards.length, fetchCards, id]);

  const handleSetFinished = async (cardsLeft: Card[]) => {
    if (!finished) {
      const response = await incrementStats(
        id,
        "setslearned",
        "basemethodmode"
      );
      if (response instanceof Error) {
        setError(response.message);
      }
    }
    setFinished(true);
    if (cardsLeft.length > 0) {
      setSetFinishedWithCardsLeftModalOpen(true);
    } else {
      setSetFinishedWithNoCardLeftModalOpen(true);
    }
  };

  const handleCardChecked = async () => {
    if (!currentCard) return;
    const response = await incrementStats(id, "cardslearned", "");
    if (response instanceof Error) {
      setError(response.message);
    }
    cards[currentCard - 1].studied = true;
    if (currentCard < cards.length) {
      setCurrentCard(currentCard + 1);
    } else {
      handleSetFinished(cardsToLearnAgainRef.current);
    }
  };

  const handleCardCrossed = async () => {
    if (!currentCard) return;
    const response = await incrementStats(
      id,
      "cardslearned",
      "cardstolearnagain"
    );
    if (response instanceof Error) {
      setError(response.message);
    }
    const updatedCards = [
      ...cardsToLearnAgainRef.current,
      cards[currentCard - 1],
    ];
    setCardsToLearnAgain(updatedCards);
    cards[currentCard - 1].studied = false;
    if (currentCard < cards.length) {
      setCurrentCard(currentCard + 1);
    } else {
      handleSetFinished(updatedCards);
    }
  };

  const Render = () => {
    const [site, setSite] = useState<boolean>(false);

    const response = SiteInaccessible({
      loading,
      currentCard,
      cards,
      error,
      id,
      router,
      minNumberOfCards: 1,
    });
    if (response) return response;
    return (
      <div className="min-h-screen flex flex-col bg-gray-200 md:text-xl">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="flex-grow flex flex-col items-center justify-center text-black">
          <TopButtonsBaseMethod
            currentCard={currentCard}
            setCurrentCard={setCurrentCard}
            cards={cards}
          />
          <div className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-md">
            {currentCard === null ? (
              <QuestionAtTheStart
                setQOrA={null}
                setCards={setCards}
                setCurrentCard={setCurrentCard}
                setTrueOrFalse={null}
                mode="basemethodmode"
              />
            ) : (
              <>
                <div
                  className="text-center cursor-pointer p-4 border rounded-md bg-gray-50 hover:bg-gray-100"
                  onClick={() => setSite(!site)}
                >
                  <QuestionOrAnswerBaseMethod
                    bool={site}
                    cards={cards}
                    currentCard={currentCard}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="w-44 text-left">
                    <button
                      onClick={handleCardCrossed}
                      className={`px-4 py-2 rounded ${
                        cards[currentCard - 1].studied === null
                          ? "hover:bg-gray-200"
                          : cards[currentCard - 1].studied === false
                          ? "bg-red-300"
                          : ""
                      }`}
                      disabled={cards[currentCard - 1].studied !== null}
                    >
                      {`I don't know ❌`}
                    </button>
                  </div>
                  <p className="text-gray-500 text-center">
                    Card {currentCard} of {cards.length}
                  </p>
                  <div className="w-44 text-right">
                    <button
                      onClick={handleCardChecked}
                      className={`px-4 py-2 rounded ${
                        cards[currentCard - 1].studied === null
                          ? "hover:bg-gray-200"
                          : cards[currentCard - 1].studied === true
                          ? "bg-green-300"
                          : ""
                      }`}
                      disabled={cards[currentCard - 1].studied !== null}
                    >
                      I know ✅
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          <BackToTheCardSetButton finished={finished} router={router} id={id} />
        </div>
        <SetFinishedWithCardsLeftModal
          isOpen={setFinishedWithCardsLeftModalOpen}
          setSetFinishedWithCardsLeftModalOpen={
            setSetFinishedWithCardsLeftModalOpen
          }
          cardsToLearnAgainRef={cardsToLearnAgainRef}
          setCardsToLearnAgain={setCardsToLearnAgain}
          setCurrentCard={setCurrentCard}
          setCards={setCards}
          id={id}
          router={router}
        />
        <SetFinishedWithNoCardLeftModal
          isOpen={setFinishedWithNoCardLeftModalOpen}
          setLoading={setLoading}
          setCards={setCards}
          setCardsToLearnAgain={setCardsToLearnAgain}
          setFinished={setFinished}
          setCurrentCard={setCurrentCard}
          setSetFinishedWithNoCardLeftModalOpen={
            setSetFinishedWithNoCardLeftModalOpen
          }
          id={id}
          router={router}
        />

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
