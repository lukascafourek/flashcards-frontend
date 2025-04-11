"use client";

import { Card } from "@/app/collections/[id]/base/page";
import React, { SetStateAction } from "react";
import { incrementStats } from "../fetches/statisticsFetches";

// This file contains functions that handle the logic for the different learning modes of the app.

export const shuffleCards = (
  setCards: React.Dispatch<SetStateAction<Card[]>>
) => {
  setCards((prevCards) => {
    const shuffled = [...prevCards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });
};

export const handleRouteChange = (
  finished: boolean,
  router: { push: (path: string) => void },
  id: string
) => {
  if (!finished) {
    const confirmation = window.confirm(
      "Are you sure you want to leave? Your progress will be lost."
    );
    if (confirmation) {
      router.push(`/collections/${id}`);
    }
  } else {
    router.push(`/collections/${id}`);
  }
};

export const handleModeFinished = async (
  id: string, 
  setError: React.Dispatch<SetStateAction<string | null>>, 
  setChoiceMade: React.Dispatch<SetStateAction<boolean>>,
  setSetFinishedWithNoCardLeftModalOpen: React.Dispatch<SetStateAction<boolean>>,
  mode: string
) => {
  const response = await incrementStats(id, "setslearned", mode);
  if (response instanceof Error) {
    setError(response.message);
  } else {
    setChoiceMade(false);
    setSetFinishedWithNoCardLeftModalOpen(true);
  }
};
