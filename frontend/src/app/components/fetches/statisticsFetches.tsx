"use client";

// This file contains functions to interact with the backend for statistics operations.
// It includes functions to increment statistics for a specific card set.

export const incrementStats = async (
  setId: string,
  firstStat: string,
  secondStat: string
) => {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/card-sets/${setId}/set-statistics/increment?firstStat=${encodeURIComponent(
        firstStat
      )}&secondStat=${encodeURIComponent(secondStat)}`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
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
