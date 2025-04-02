"use client";

import { BACKEND } from "../page";

export const getUserStatistics = async () => {
  try {
    const response = await fetch(
      `${BACKEND}/user-statistics/values`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch user statistics");
    }
  } catch (error) {
    return (error as Error).message;
  }
};
