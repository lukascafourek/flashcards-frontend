import { motion } from "motion/react";

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <motion.div
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
}

export const LoadingSpinnerSmall = () => {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
}
