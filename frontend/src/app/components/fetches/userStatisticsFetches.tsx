"use client";

// This file contains functions to interact with the backend API for user statistics operations.
// It includes a function to fetch user statistics.

export const getUserStatistics = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user-statistics/values`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
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
