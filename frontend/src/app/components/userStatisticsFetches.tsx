"use client";

export const getUserStatistics = async () => {
  try {
    const response = await fetch(
      "http://localhost:8080/user-statistics/values",
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
