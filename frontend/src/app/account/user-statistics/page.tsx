"use client";

import Header from "@/app/components/header";
import AuthProvider from "@/app/context/authContext";
import Footer from "@/app/components/footer";
import { useState, useEffect } from "react";
import { getUserStatistics } from "@/app/components/userStatisticsFetches";

export default function ShowUserStatistics() {
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
      <div className="min-h-screen bg-gray-200 flex flex-col">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="flex justify-center items-center min-h-[80vh] flex-grow">
          <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-center text-black text-xl font-semibold mb-8">
              Your Global Statistics
            </h2>
            <p className="text-black mb-2">
              Total Sets Learned: {userStatistics?.totalSetsLearned}
            </p>
            <p className="text-black mb-2">
              Total Cards Learned: {userStatistics?.totalCardsLearned}
            </p>
            <p className="text-black mb-2">
              Total Cards To Learn Again:{" "}
              {userStatistics?.totalCardsToLearnAgain}
            </p>
            <p className="text-black mb-2">
              Percentage Success Rate: {userStatistics?.percentCorrect} %
            </p>
            <p className="text-black mb-2">
              Sets Created: {userStatistics?.setsCreated}
            </p>
            <p className="text-black mb-2">
              Cards Created: {userStatistics?.cardsCreated}
            </p>
            <p className="text-black mb-2">
              Base Method Modes Played: {userStatistics?.baseMethodModes}
            </p>
            <p className="text-black mb-2">
              Multiple Choice Modes Played:{" "}
              {userStatistics?.multipleChoiceModes}
            </p>
            <p className="text-black mb-2">
              True Or False Modes Played: {userStatistics?.trueFalseModes}
            </p>
            {error && <p className="text-red-500 text-center">{error}</p>}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    );
  };

  return (
    <AuthProvider>
      <Render />
    </AuthProvider>
  );
}
