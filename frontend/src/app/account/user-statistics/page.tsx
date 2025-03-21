"use client";

import Header from "@/app/components/header";
import AuthProvider from "@/app/context/authContext";
import Footer from "@/app/components/footer";
import { useState, useEffect } from "react";
import { getUserStatistics } from "@/app/components/userStatisticsFetches";

export default function ShowUserStatistics() {
  const [userStatistics, setUserStatistics] = useState<{
    totalSetsLearned: number, 
    totalCardsLearned: number,
    totalCardsToLearnAgain: number,
    setsCreated: number,
    cardsCreated: number,
    baseMethodModes: number,
    multipleChoiceModes: number,
    connectionModes: number
  } | null>(null);
  const [error, setError] = useState("");

  const fetchUserStatistics = async () => {
    const data = await getUserStatistics();
    if (data) {
      setUserStatistics({
        totalSetsLearned: data.totalSetsLearned,
        totalCardsLearned: data.totalCardsLearned,
        totalCardsToLearnAgain: data.totalCardsToLearnAgain,
        setsCreated: data.setsCreated,
        cardsCreated: data.cardsCreated,
        baseMethodModes: data.baseMethodModes,
        multipleChoiceModes: data.multipleChoiceModes,
        connectionModes: data.connectionModes,
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
            <h2 className="text-center text-black text-xl font-semibold mb-8">Your Global Statistics</h2>
            <p className="text-black font-semibold mb-2">Total Sets Learned: </p>
            <p className="text-black mb-2">{userStatistics?.totalSetsLearned}</p>
            <p className="text-black font-semibold mb-2">Total Cards Learned: </p>
            <p className="text-black mb-2">{userStatistics?.totalCardsLearned}</p>
            <p className="text-black font-semibold mb-2">Total Cards to Learn Again: </p>
            <p className="text-black mb-2">{userStatistics?.totalCardsToLearnAgain}</p>
            <p className="text-black font-semibold mb-2">Sets Created: </p>
            <p className="text-black mb-2">{userStatistics?.setsCreated}</p>
            <p className="text-black font-semibold mb-2">Cards Created: </p>
            <p className="text-black mb-2">{userStatistics?.cardsCreated}</p>
            <p className="text-black font-semibold mb-2">Base Method Modes: </p>
            <p className="text-black mb-2">{userStatistics?.baseMethodModes}</p>
            <p className="text-black font-semibold mb-2">Multiple Choice Modes: </p>
            <p className="text-black mb-2">{userStatistics?.multipleChoiceModes}</p>
            <p className="text-black font-semibold mb-2">Connection Modes: </p>
            <p className="text-black mb-4">{userStatistics?.connectionModes}</p>
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
