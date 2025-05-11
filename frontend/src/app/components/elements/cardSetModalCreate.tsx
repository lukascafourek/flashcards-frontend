"use client";

import { useState } from "react";
import { createSet } from "@/app/components/fetches/cardSetFetches";
import { handleChange } from "@/app/components/functions/inputValidation";

// This file contains the CardSetModalCreate component, which is used to create a new card set in the flashcard app.
// It includes a modal with a form for entering the set name, category, and description.
// The component also handles the creation of the card set and redirects to the new set page after creation.

const CardSetModalCreate = ({
  categories,
  router,
  MAX_CHAR_LIMIT,
  isOpen,
  setIsModalOpen,
}: {
  categories: string[];
  router: { push: (path: string) => void };
  MAX_CHAR_LIMIT: number;
  isOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [setName, setSetName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateSet = async () => {
    const response = await createSet(setName, category, description);
    if (response instanceof Error) {
      alert(response.message);
    } else {
      setIsModalOpen(false);
      router.push(`/collections/${response}`);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl text-black font-semibold mb-4">
              Create a New Card Set
            </h2>
            <label className="block text-black mb-1">Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md mb-4 text-black"
              placeholder="Enter card set name"
              value={setName}
              onChange={(e) =>
                handleChange(e.target.value, setSetName, MAX_CHAR_LIMIT)
              }
            />
            <label
              htmlFor="category"
              className="block text-black mb-1"
            >
              Category
            </label>
            <select
              id="category"
              className="w-full p-2 border rounded-md mb-4 text-black"
              value={category}
              onChange={(e) =>
                handleChange(e.target.value, setCategory, MAX_CHAR_LIMIT)
              }
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <label className="block text-black mb-1">
              Description
            </label>
            <textarea
              className="w-full p-2 border rounded-md mb-1 text-black resize"
              placeholder="Enter a description (optional)"
              value={description}
              onChange={(e) =>
                handleChange(e.target.value, setDescription, MAX_CHAR_LIMIT)
              }
              style={{
                resize: "vertical",
                overflowWrap: "break-word",
                minHeight: "25px",
              }}
            />
            <div className="text-sm text-gray-500 mb-4">
              {description.length}/{MAX_CHAR_LIMIT} characters
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all"
                onClick={() => {
                  setIsModalOpen(false);
                  setSetName("");
                  setCategory("");
                  setDescription("");
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md transition-all enabled:hover:bg-green-600"
                disabled={!setName.trim() || !category.trim()}
                onClick={handleCreateSet}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CardSetModalCreate;
