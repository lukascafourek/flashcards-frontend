"use client";

import Image from "next/image";
import Header from "./header";
import Footer from "./footer";
import { LoadingSpinner } from "./loadingCircle";
import { Card } from "@/app/collections/[id]/base/page";
import {
  handleModeFinished,
  shuffleCards,
  handleRouteChange,
} from "../functions/modesHandle";
import React, { useEffect, useRef, useState } from "react";

// This file contains various components used in the flashcard app for different modes of study.
// These components include elements for displaying questions and answers, navigation buttons, and handling user interactions.

const SiteInaccessible = ({
  loading,
  currentCard,
  cards,
  error,
  id,
  router,
  minNumberOfCards,
}: {
  loading: boolean;
  currentCard: number | null;
  cards: Card[];
  error: string | null;
  id: string;
  router: { push: (path: string) => void };
  minNumberOfCards: number;
}) => {
  if (loading || (currentCard !== null && !cards[currentCard - 1])) {
    return <LoadingSpinner />;
  }
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-200">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-red-500 text-center flex-grow my-8">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }
  if (cards.length < minNumberOfCards) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-200">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center">
          <p className="text-red-500 text-center">
            {minNumberOfCards === 1
              ? "No cards found in this set."
              : `You need at least ${minNumberOfCards} cards to play this mode.`}
          </p>
          <button
            onClick={() => router.push(`/collections/${id}`)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mx-auto mb-4 mt-4"
          >
            Back to the Card Set
          </button>
        </div>
        <Footer />
      </div>
    );
  }
  return null;
};

const TopButtonsBaseMethod = ({
  currentCard,
  setCurrentCard,
  cards,
}: {
  currentCard: number | null;
  setCurrentCard: React.Dispatch<React.SetStateAction<number | null>>;
  cards: Card[];
}) => {
  return (
    <>
      {currentCard && (
        <div className="flex justify-between w-full max-w-6xl my-4">
          <button
            onClick={() => {
              if (currentCard > 1) {
                setCurrentCard(currentCard - 1);
              }
            }}
            className={`px-4 py-2 rounded bg-gray-400 hover:bg-gray-300 ${
              currentCard === 1 ? "hidden" : "block"
            }`}
            disabled={currentCard === 1}
          >
            Previous
          </button>
          <div className="flex justify-end w-full">
            <button
              onClick={() => {
                if (currentCard < cards.length) {
                  setCurrentCard(currentCard + 1);
                }
              }}
              className={`px-4 py-2 rounded bg-gray-400 hover:bg-gray-300 ${
                currentCard === cards.length ||
                cards[currentCard - 1].studied === null
                  ? "hidden"
                  : "block"
              }`}
              disabled={
                currentCard === cards.length ||
                cards[currentCard - 1].studied === null
              }
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const TopButtons = ({
  currentCard,
  cards,
  setCurrentCard,
  setChoiceMade,
  setPossibleChoices,
  setTrueOrFalse,
  finished,
  id,
  setError,
  setSetFinishedWithNoCardLeftModalOpen,
  mode,
}: {
  currentCard: number | null;
  cards: Card[];
  setCurrentCard: React.Dispatch<React.SetStateAction<number | null>>;
  setChoiceMade: React.Dispatch<React.SetStateAction<boolean>>;
  setPossibleChoices: React.Dispatch<React.SetStateAction<Card[]>> | null;
  setTrueOrFalse: React.Dispatch<React.SetStateAction<boolean | null>> | null;
  finished: boolean;
  id: string;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setSetFinishedWithNoCardLeftModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  mode: string;
}) => {
  return (
    <>
      {currentCard && (
        <div className="flex justify-end w-full max-w-6xl my-4">
          <button
            onClick={() => {
              if (currentCard < cards.length) {
                setCurrentCard(currentCard + 1);
                setChoiceMade(false);
                if (setPossibleChoices) setPossibleChoices([]);
                if (setTrueOrFalse) setTrueOrFalse(Math.random() < 0.5);
              }
            }}
            className={`px-4 py-2 rounded bg-gray-400 hover:bg-gray-300 ${
              currentCard === cards.length ||
              cards[currentCard - 1].studied === null
                ? "hidden"
                : "block"
            }`}
            disabled={
              currentCard === cards.length ||
              cards[currentCard - 1].studied === null
            }
          >
            Next
          </button>
          {finished && (
            <button
              onClick={async () => {
                await handleModeFinished(
                  id,
                  setError,
                  setChoiceMade,
                  setSetFinishedWithNoCardLeftModalOpen,
                  mode
                );
              }}
              className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 ml-4"
            >
              Finish
            </button>
          )}
        </div>
      )}
    </>
  );
};

const QuestionAtTheStart = ({
  setQOrA,
  setCards,
  setCurrentCard,
  setTrueOrFalse,
  mode,
}: {
  setQOrA: React.Dispatch<React.SetStateAction<boolean>> | null;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  setCurrentCard: React.Dispatch<React.SetStateAction<number | null>>;
  setTrueOrFalse: React.Dispatch<React.SetStateAction<boolean | null>> | null;
  mode: string;
}) => {
  return (
    <div className="text-center">
      <p className="mb-4 font-semibold">
        {mode === "truefalsemode"
          ? "Do you want to choose whether the answer or the question is true?"
          : mode === "multiplechoicemode"
          ? "Do you want to choose from multiple answers or questions?"
          : "Do you want to shuffle the cards?"}
      </p>
      <div className="flex space-x-4 items-center justify-center">
        <button
          onClick={() => {
            if (setQOrA) setQOrA(false);
            shuffleCards(setCards);
            setCurrentCard(1);
            if (setTrueOrFalse) setTrueOrFalse(Math.random() < 0.5);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {mode === "truefalsemode"
            ? "Answer"
            : mode === "multiplechoicemode"
            ? "Answers"
            : "Yes"}
        </button>
        <button
          onClick={() => {
            if (setQOrA) setQOrA(true);
            if (mode !== "basemethodmode") shuffleCards(setCards);
            setCurrentCard(1);
            if (setTrueOrFalse) setTrueOrFalse(Math.random() < 0.5);
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          {mode === "truefalsemode"
            ? "Question"
            : mode === "multiplechoicemode"
            ? "Questions"
            : "No"}
        </button>
      </div>
    </div>
  );
};

const QuestionOrAnswerDisplay = ({
  bool,
  cards,
  currentCard,
}: {
  bool: boolean;
  cards: Card[];
  currentCard: number;
}) => {
  const card = cards[currentCard - 1];
  const questionRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const questionHeight = questionRef.current?.offsetHeight || 0;
    const answerHeight = answerRef.current?.offsetHeight || 0;
    setMaxHeight(Math.max(questionHeight, answerHeight));
  }, [card]);

  return (
    <div
      className="flex flex-col justify-center items-center text-center transition-all duration-300 overflow-hidden"
      style={{ height: maxHeight }}
    >
      <div
        ref={answerRef}
        className={`w-full ${
          bool ? "block" : "absolute opacity-0 pointer-events-none"
        }`}
      >
        <h1 className="font-bold mb-4">Answer</h1>
        <p className="font-semibold whitespace-pre-line">{card.back}</p>
      </div>
      <div
        ref={questionRef}
        className={`w-full ${
          !bool ? "block" : "absolute opacity-0 pointer-events-none"
        }`}
      >
        <h1 className="font-bold mb-4">Question</h1>
        {card.picture && card.mimeType && (
          <Image
            src={`data:${card.mimeType};base64,${card.picture}`}
            alt="Card Image"
            className="max-w-64 max-h-64 mb-2 mx-auto"
            width={500}
            height={500}
          />
        )}
        <p className="font-semibold whitespace-pre-line">{card.front}</p>
      </div>
    </div>
  );
};

const BottomQuestionOrAnswer = ({
  qOrA,
  option,
}: {
  qOrA: boolean;
  option: Card;
}) => {
  return (
    <>
      <h1 className="font-bold mb-4 text-center md:text-base text-xs">
        {qOrA ? "Question" : "Answer"}
      </h1>
      {qOrA ? (
        <>
          {option.picture && option.mimeType && (
            <Image
              src={`data:${option.mimeType};base64,${option.picture}`}
              alt="Card Image"
              className="max-w-64 max-h-64 mb-2 center mx-auto my-auto"
              width={500}
              height={500}
            />
          )}
          <p className="font-semibold whitespace-pre-line">{option.front}</p>
        </>
      ) : (
        <p className="font-semibold whitespace-pre-line">{option.back}</p>
      )}
    </>
  );
};

const BackToTheCardSetButton = ({
  finished,
  router,
  id,
}: {
  finished: boolean;
  router: { push: (path: string) => void };
  id: string;
}) => {
  return (
    <button
      onClick={() => handleRouteChange(finished, router, id)}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 my-4 mx-auto"
    >
      Back to the Card Set
    </button>
  );
};

const CardOfTotal = ({
  currentCard,
  cards,
}: {
  currentCard: number;
  cards: Card[];
}) => {
  return (
    <p className="text-gray-500 mt-4 text-center">
      Card {currentCard} of {cards.length}
    </p>
  );
};

export {
  SiteInaccessible,
  TopButtonsBaseMethod,
  TopButtons,
  QuestionAtTheStart,
  QuestionOrAnswerDisplay,
  BottomQuestionOrAnswer,
  BackToTheCardSetButton,
  CardOfTotal,
};
