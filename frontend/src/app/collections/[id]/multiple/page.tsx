"use client";

import Header from "@/app/components/elements/header";
import AuthProvider from "@/app/context/authContext";
import Footer from "@/app/components/elements/footer";
import { Card } from "../base/page";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { incrementStats } from "@/app/components/fetches/statisticsFetches";
import clsx from "clsx";
import { LoadingSpinnerSmall } from "@/app/components/elements/loadingCircle";
import SetFinishedWithNoCardLeftModal from "@/app/components/elements/setFinishedNoCards";
import { useFetchCards } from "@/app/hooks/useFetchCards";
import {
  BottomQuestionOrAnswer,
  QuestionAtTheStart,
  SiteInaccessible,
  TopButtons,
  TopQuestionOrAnswer,
  BackToTheCardSetButton,
  CardOfTotal,
} from "@/app/components/elements/similarModeElements";

// This component is the main page for the Multiple Choice learning mode of the application.
// It allows the user to choose the correct answer from multiple options for each card in a set.
export default function MultipleMethod() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [possibleChoices, setPossibleChoices] = useState<Card[]>([]);
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
  const [thisCard, setThisCard] = useState(false);

  const fetchCards = useFetchCards();

  const generatePossibleChoices = useCallback(() => {
    if (currentCard === null || !cards[currentCard - 1]) return;
    const current = cards[currentCard - 1];
    const shuffledCards = cards
      .filter((card) => card !== current)
      .sort(() => Math.random() - 0.5);
    const otherCards = shuffledCards.slice(0, 3);
    const choices = [current, ...otherCards];
    const shuffledChoices: Card[] = choices.map((card) => ({
      ...card,
      studied: null,
    }));
    for (let i = shuffledChoices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledChoices[i], shuffledChoices[j]] = [
        shuffledChoices[j],
        shuffledChoices[i],
      ];
    }
    setPossibleChoices(shuffledChoices);
  }, [cards, currentCard]);

  useEffect(() => {
    if (
      currentCard === null ||
      !cards[currentCard - 1] ||
      possibleChoices.length === 0
    ) {
      setThisCard(false);
      return;
    }
    const studiedCardExists = possibleChoices.some(
      (card) => card.studied !== null
    );
    setThisCard(!(studiedCardExists && cards[currentCard - 1].studied === null));
  }, [currentCard, cards, possibleChoices]);

  useEffect(() => {
    if (cards.length === 0) {
      fetchCards(id, setCards)
        .then((error) => setError(error || ""))
        .finally(() => setLoading(false));
    }
    generatePossibleChoices();
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [cards, fetchCards, id, generatePossibleChoices, currentCard]);

  const handleChoiceClick = async (option: Card, choices: Card[]) => {
    if (currentCard === null || !cards[currentCard - 1]) return;
    const isCorrectChoice = option.id === cards[currentCard - 1].id;
    const response = await incrementStats(
      id,
      "cardslearned",
      isCorrectChoice ? "" : "cardstolearnagain"
    );
    if (response instanceof Error) {
      setError(response.message);
    }
    cards[currentCard - 1].studied = isCorrectChoice;
    setPossibleChoices(
      choices.map((choice) => ({
        ...choice,
        studied:
          choice.id === cards[currentCard - 1].id
            ? true
            : choice.id === option.id
            ? false
            : null,
      }))
    );
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
      minNumberOfCards: 4,
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
            setPossibleChoices={setPossibleChoices}
            setTrueOrFalse={null}
            finished={finished}
            id={id}
            setError={setError}
            setSetFinishedWithNoCardLeftModalOpen={
              setSetFinishedWithNoCardLeftModalOpen
            }
            mode="multiplechoicemode"
          />
          <div className="w-full max-w-6xl p-6 bg-white rounded-lg shadow-md">
            {currentCard === null ? (
              <QuestionAtTheStart
                setQOrA={setQOrA}
                setCards={setCards}
                setCurrentCard={setCurrentCard}
                setTrueOrFalse={null}
                mode="multiplechoicemode"
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
                {thisCard ? (
                  <>
                    <p className="text-center text-gray-500 mt-4">
                      Choose the correct {qOrA ? "question" : "answer"} from the
                      options below:
                    </p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-4">
                      {possibleChoices.map((option, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            if (!choiceMade) {
                              handleChoiceClick(option, possibleChoices);
                            }
                          }}
                          className={clsx(
                            `p-4 rounded-md border text-center ${
                              choiceMade ? "cursor-default" : "cursor-pointer"
                            }`,
                            {
                              "bg-green-100 border-green-500 hover:bg-green-200":
                                option.studied === true,
                              "bg-red-100 border-red-500 hover:bg-red-200":
                                option.studied === false,
                              "bg-gray-50 hover:bg-gray-100": !option.studied,
                            }
                          )}
                        >
                          <BottomQuestionOrAnswer qOrA={qOrA} option={option} />
                        </div>
                      ))}
                    </div>
                    <CardOfTotal currentCard={currentCard} cards={cards} />
                  </>
                ) : (
                  <LoadingSpinnerSmall />
                )}
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
