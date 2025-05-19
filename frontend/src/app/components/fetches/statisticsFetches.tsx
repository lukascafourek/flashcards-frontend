"use client";

import Cookies from "js-cookie";

// This file contains functions to interact with the backend for statistics operations.
// It includes a function to fetch set statistics and a function to increment statistics.

export const getSetStatistics = async (setId : string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/card-sets/${setId}/set-statistics/values`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${Cookies.get('jwt')}` },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch set statistics");
    }
  } catch (error) {
    return (error as Error).message;
  }
};

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
        headers: { Authorization: `Bearer ${Cookies.get('jwt')}` },
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
