import { motion } from "motion/react";

// This file contains the LoadingSpinner and LoadingSpinnerSmall components, which are used to display loading spinners in the flashcard app.
// The spinners are animated using the Framer Motion library and are used to indicate loading states in the app.

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <motion.div
        className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
}

export const LoadingSpinnerSmall = () => {
  return (
    <div className="flex items-center justify-center mx-auto my-auto">
      <motion.div
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
}
