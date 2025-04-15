"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/app/components/elements/header";
import AuthProvider from "@/app/context/authContext";
import Footer from "@/app/components/elements/footer";
import { Card } from "../base/page";
import { incrementStats } from "@/app/components/fetches/statisticsFetches";
import { LoadingSpinnerSmall } from "@/app/components/elements/loadingCircle";
import SetFinishedWithNoCardLeftModal from "@/app/components/elements/setFinishedNoCards";
import { useFetchCards } from "@/app/hooks/useFetchCards";
import {
  QuestionAtTheStart,
  SiteInaccessible,
  TopButtons,
  TopQuestionOrAnswer,
  BottomQuestionOrAnswer,
  BackToTheCardSetButton,
  CardOfTotal,
} from "@/app/components/elements/similarModeElements";

// This component is the main page for the True/False learning mode of the application.
// It allows the user to choose whether the answer (question) to a question (answer) is true or false.
// It also allows the user to see the correct card after making a choice if the displayed option was a false card.
export default function TrueFalseMethod() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [falseCard, setFalseCard] = useState<Card | null>(null);
  const [trueOrFalse, setTrueOrFalse] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(cards.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [
    setFinishedWithNoCardLeftModalOpen,
    setSetFinishedWithNoCardLeftModalOpen,
  ] = useState(false);
  const [currentCard, setCurrentCard] = useState<number | null>(null);
  const [qOrA, setQOrA] = useState<boolean>(false);
  const [finished, setFinished] = useState(false);
  const [choiceMade, setChoiceMade] = useState(false);

  const fetchCards = useFetchCards();

  const generateFalseCard = useCallback(() => {
    if (
      currentCard === null ||
      !cards[currentCard - 1] ||
      trueOrFalse !== false
    ) {
      setFalseCard(null);
      return;
    }
    const otherCards = cards.filter((card) => card !== cards[currentCard - 1]);
    const randomIndex = Math.floor(Math.random() * otherCards.length);
    otherCards[randomIndex].studied = null;
    setFalseCard(otherCards[randomIndex]);
  }, [cards, currentCard, trueOrFalse]);

  useEffect(() => {
    generateFalseCard();
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
  }, [cards.length, fetchCards, id, generateFalseCard, currentCard]);

  const handlePreviousChoices = () => {
    if (currentCard === null || !cards[currentCard - 1]) return false;
    return (
      !falseCard ||
      !(falseCard.studied && cards[currentCard - 1].studied === null)
    );
  };

  const handleChoiceClick = async (choice: boolean) => {
    if (currentCard === null || !cards[currentCard - 1]) return;
    const isCorrectChoice = choice === !falseCard;
    const response = await incrementStats(
      id,
      "cardslearned",
      isCorrectChoice ? "" : "cardstolearnagain"
    );
    if (response instanceof Error) {
      setError(response.message);
      return;
    }
    cards[currentCard - 1].studied = isCorrectChoice;
    if (falseCard) {
      falseCard.studied = isCorrectChoice;
    }
    setChoiceMade(true);
    if (currentCard === cards.length) {
      setFinished(true);
    }
  };

  const Render = () => {
    const response = SiteInaccessible({
      loading,
      currentCard,
      cards,
      error,
      id,
      router,
      minNumberOfCards: 2,
    });
    if (response) return response;
    return (
      <div className="min-h-screen flex flex-col bg-gray-200 md:text-xl">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="flex-grow flex flex-col items-center justify-center text-black">
          <TopButtons
            currentCard={currentCard}
            cards={cards}
            setCurrentCard={setCurrentCard}
            setChoiceMade={setChoiceMade}
            setPossibleChoices={null}
            setTrueOrFalse={setTrueOrFalse}
            finished={finished}
            id={id}
            setError={setError}
            setSetFinishedWithNoCardLeftModalOpen={
              setSetFinishedWithNoCardLeftModalOpen
            }
            mode="truefalsemode"
          />
          <div className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-md">
            {currentCard === null ? (
              <QuestionAtTheStart
                setQOrA={setQOrA}
                setCards={setCards}
                setCurrentCard={setCurrentCard}
                setTrueOrFalse={setTrueOrFalse}
                mode="truefalsemode"
              />
            ) : (
              <>
                <div className="text-center p-4 border rounded-md bg-gray-50">
                  <TopQuestionOrAnswer
                    bool={qOrA}
                    cards={cards}
                    currentCard={currentCard}
                  />
                </div>
                {trueOrFalse === true && handlePreviousChoices() ? (
                  <>
                    <div className="text-center p-4 mt-2 border rounded-md bg-gray-50">
                      <BottomQuestionOrAnswer
                        qOrA={qOrA}
                        option={cards[currentCard - 1]}
                      />
                    </div>
                    <CardOfTotal currentCard={currentCard} cards={cards} />
                  </>
                ) : trueOrFalse === false &&
                  falseCard &&
                  handlePreviousChoices() ? (
                  <>
                    <div className="text-center p-4 mt-2 border rounded-md bg-gray-50">
                      <BottomQuestionOrAnswer qOrA={qOrA} option={falseCard} />
                    </div>
                    <CardOfTotal currentCard={currentCard} cards={cards} />
                  </>
                ) : (
                  <LoadingSpinnerSmall />
                )}
              </>
            )}
            {currentCard && (
              <div className="flex space-x-4 mt-2 items-center justify-center">
                <button
                  onClick={() => {
                    handleChoiceClick(true);
                  }}
                  className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ${
                    choiceMade && cards[currentCard - 1].studied !== null ? "hidden" : "block"
                  }`}
                >
                  TRUE
                </button>
                {currentCard && (
                  <p
                    className={`text-gray-500 text-center ${
                      choiceMade && cards[currentCard - 1].studied !== null ? "block" : "hidden"
                    }`}
                  >
                    Your choice is{" "}
                    <span
                      className={`${
                        cards[currentCard - 1].studied === true
                          ? "text-green-500 font-semibold"
                          : "text-red-500 font-semibold"
                      }`}
                    >
                      {cards[currentCard - 1].studied === true
                        ? "CORRECT"
                        : "INCORRECT"}
                    </span>
                  </p>
                )}
                <button
                  onClick={() => {
                    handleChoiceClick(false);
                  }}
                  className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ${
                    choiceMade && cards[currentCard - 1].studied !== null ? "hidden" : "block"
                  }`}
                >
                  FALSE
                </button>
              </div>
            )}
            {choiceMade && falseCard && currentCard && cards[currentCard - 1].studied !== null && (
              <>
                <p className="text-gray-500 mt-2 text-center">
                  The true {qOrA ? "question" : "answer"} to the{" "}
                  {qOrA ? "answer" : "question"} was:
                </p>
                <div className="text-center p-4 border rounded-md bg-gray-50">
                  <BottomQuestionOrAnswer
                    qOrA={qOrA}
                    option={cards[currentCard - 1]}
                  />
                </div>
              </>
            )}
          </div>
          <BackToTheCardSetButton finished={finished} router={router} id={id} />
        </div>
        <SetFinishedWithNoCardLeftModal
          isOpen={setFinishedWithNoCardLeftModalOpen}
          setLoading={setLoading}
          setCards={setCards}
          setCardsToLearnAgain={null}
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
