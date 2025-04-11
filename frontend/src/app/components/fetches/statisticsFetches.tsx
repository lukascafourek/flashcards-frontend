"use client";

import { BACKEND } from "@/app/page";

// This file contains functions to interact with the backend API for statistics operations.
// It includes functions to increment statistics for a specific card set.

export const incrementStats = async (
  setId: string,
  firstStat: string,
  secondStat: string
) => {
  try {
    const response = await fetch(
      `${BACKEND}/card-sets/${setId}/set-statistics/increment?firstStat=${encodeURIComponent(
        firstStat
      )}&secondStat=${encodeURIComponent(secondStat)}`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );
    if (response.ok) {
      return null;
    } else {
      throw new Error("Failed to increment statistics");
    }
  } catch (error) {
    return error as Error;
  }
};
