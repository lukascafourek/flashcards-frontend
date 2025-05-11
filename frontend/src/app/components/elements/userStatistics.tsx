"use client";

import AuthProvider from "@/app/context/authContext";
import { useState, useEffect } from "react";
import { getUserStatistics } from "@/app/components/fetches/userStatisticsFetches";

// This file contains the UserStatistics component, which is used to display the user's global statistics in the flashcard app.

const UserStatistics = () => {
  const [userStatistics, setUserStatistics] = useState<{
    totalSetsLearned: number;
    totalCardsLearned: number;
    totalCardsToLearnAgain: number;
    percentCorrect: number;
    setsCreated: number;
    cardsCreated: number;
    baseMethodModes: number;
    multipleChoiceModes: number;
    trueFalseModes: number;
  } | null>(null);
  const [error, setError] = useState("");

  const fetchUserStatistics = async () => {
    const data = await getUserStatistics();
    if (data) {
      setUserStatistics({
        totalSetsLearned: data.totalSetsLearned,
        totalCardsLearned: data.totalCardsLearned,
        totalCardsToLearnAgain: data.totalCardsToLearnAgain,
        percentCorrect:
          data.totalCardsLearned > 0
            ? 100 - (data.totalCardsToLearnAgain / data.totalCardsLearned) * 100
            : 0,
        setsCreated: data.setsCreated,
        cardsCreated: data.cardsCreated,
        baseMethodModes: data.baseMethodModes,
        multipleChoiceModes: data.multipleChoiceModes,
        trueFalseModes: data.trueFalseModes,
      });
    } else {
      setError("Failed to fetch user statistics");
    }
  };

  useEffect(() => {
    fetchUserStatistics();
  }, []);

  const Render = () => {
    return (
      <div className="w-full max-w-xl p-6 bg-white rounded-lg shadow-md my-8 md:min-h-[450px] min-h-[400px]">
        <h2 className="text-center text-black text-xl font-semibold mb-8">
          Your Global Statistics
        </h2>
        <p className="text-black mb-2">
          Total Sets Finished: {userStatistics?.totalSetsLearned}
        </p>
        <p className="text-black mb-2">
          Total Cards Learned: {userStatistics?.totalCardsLearned}
        </p>
        <p className="text-black mb-2">
          Total Cards To Learn Again: {userStatistics?.totalCardsToLearnAgain}
        </p>
        <p className="text-black mb-2">
          Percentage Success Rate: {userStatistics?.percentCorrect.toFixed(2)} %
        </p>
        <p className="text-black mb-2">
          Sets Created: {userStatistics?.setsCreated}
        </p>
        <p className="text-black mb-2">
          Cards Created: {userStatistics?.cardsCreated}
        </p>
        <p className="text-black mb-2">
          Base Method Modes Finished: {userStatistics?.baseMethodModes}
        </p>
        <p className="text-black mb-2">
          Multiple Choice Modes Finished: {userStatistics?.multipleChoiceModes}
        </p>
        <p className="text-black mb-2">
          True Or False Modes Finished: {userStatistics?.trueFalseModes}
        </p>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>
    );
  };

  return (
    <AuthProvider>
      <Render />
    </AuthProvider>
  );
};

export default UserStatistics;
