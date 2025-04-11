"use client";

import { SetStateAction, useCallback } from "react";
import { Card } from "../collections/[id]/base/page";
import { getCards } from "../components/fetches/cardFetches";

// This hook fetches cards from the server and updates the state with the fetched cards.
// It takes a set ID and a state setter function as arguments.
export function useFetchCards() {
  return useCallback(
    async (id: string, setCards: React.Dispatch<SetStateAction<Card[]>>) => {
      const response = await getCards(id);
      if (response instanceof Error) {
        return response.message;
      } else {
        const initializedCards: Card[] = response.map((card: Card) => ({
          ...card,
          studied: null,
        }));
        setCards(initializedCards);
        return null;
      }
    },
    []
  );
}
