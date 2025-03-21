"use client";

import { useState } from "react";
import Header from "@/app/components/header";
import AuthProvider from "../context/authContext";
import Footer from "../components/footer";
import Link from "next/link";

const categories = [
  "MATH", "HISTORY", "GEOGRAPHY", "BIOLOGY", "CHEMISTRY",
  "PHYSICS", "LITERATURE", "ART", "MUSIC", "SPORTS",
  "MOVIES", "GAMES", "FOOD", "ANIMALS", "TECHNOLOGY",
  "CARS", "POLITICS", "RELIGION", "OTHER"
];

const dummyCollections = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Card Set ${i + 1}`,
  category: ["Science", "Math", "History", "Language"][i % 4],
  creator: `User${(i % 5) + 1}`,
  date: `2024-02-${(i % 28) + 1}`,
}));

export default function Collections() {
  const Render = () => {
    const itemsPerPage = 20;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(dummyCollections.length / itemsPerPage);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [setName, setSetName] = useState("");
    const [category, setCategory] = useState("");
    const paginatedCollections = dummyCollections.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    const handleCreateSet = () => {
      alert(`Set created: ${setName} (${category})`);
      setIsModalOpen(false);
    };
  
    return (
        <div className="min-h-screen bg-gray-200 flex flex-col">
          {/* Header */}
          <Header />
        
          {/* Welcome Text */}
          <div className="bg-gray-900 text-xl text-white text-center py-10">
            This is the Collections Page where you can browse through all the collections and filter them.
          </div>
        
          {/* Collections Grid */}
          <div className="container mx-auto p-5 flex-grow">
            <div className="grid grid-cols-5 gap-5">
              {paginatedCollections.map((collection) => (
                <Link key={collection.id} href={`/collections/${collection.id}`} className="block">
                  <div className="bg-white p-4 shadow-lg rounded-xl cursor-pointer hover:shadow-xl transition-all">
                    <h2 className="text-lg text-black font-semibold">{collection.title}</h2>
                    <p className="text-sm text-gray-600">Category: {collection.category}</p>
                    <p className="text-sm text-gray-600">Creator: {collection.creator}</p>
                    <p className="text-sm text-gray-600">Created: {collection.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        
          {/* Pagination */}
          <div className="flex justify-center space-x-2 my-5">
            <button
              className={`px-4 py-2 rounded-md ${currentPage === 1 ? "bg-gray-400" : "bg-gray-800 text-white hover:bg-gray-600"}`}
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
        
            <button
              className={`px-4 py-2 rounded-md ${currentPage === 1 ? "bg-gray-400" : "bg-gray-800 text-white hover:bg-gray-600"}`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
        
            <span className="px-4 py-2 text-black bg-gray-300 rounded-md">
              Page {currentPage} of {totalPages}
            </span>
        
            <button
              className={`px-4 py-2 rounded-md ${currentPage === totalPages ? "bg-gray-400" : "bg-gray-800 text-white hover:bg-gray-600"}`}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
        
            <button
              className={`px-4 py-2 rounded-md ${currentPage === totalPages ? "bg-gray-400" : "bg-gray-800 text-white hover:bg-gray-600"}`}
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>

          {/* Floating Add Button */}
            <button
              className="fixed bottom-10 right-10 bg-green-600 text-white p-5 rounded-full shadow-lg text-2xl hover:bg-green-500 transition-all w-16 h-16 flex items-center justify-center"
              onClick={() => setIsModalOpen(true)}
            >
            +
            </button>

          {/* Create Set Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl text-black font-semibold mb-4">Create a New Card Set</h2>
                <label className="block text-black font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md mb-4 text-black"
                  placeholder="Enter card set name"
                  value={setName}
                  onChange={(e) => setSetName(e.target.value)}
                />
                <label htmlFor="category" className="block text-black font-medium mb-1">Category</label>
                <select
                  id="category"
                  className="w-full p-2 border rounded-md mb-4 text-black"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="flex justify-end space-x-2">
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-400 transition-all"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className={`px-4 py-2 bg-green-600 text-white rounded-md transition-all ${!setName.trim() || !category.trim() ?  "" : "hover:bg-green-500"}`}
                    disabled={!setName.trim() || !category.trim()}
                    onClick={handleCreateSet}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}

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
