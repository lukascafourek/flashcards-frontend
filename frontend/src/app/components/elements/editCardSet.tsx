"use client";

import { useState } from "react";
import Image from "next/image";
import { handleChange } from "../functions/inputValidation";
import { updateSet, updateSetFavorite } from "../fetches/cardSetFetches";
import { CardSet } from "@/app/collections/[id]/page";

// This file contains the EditCardSet component, which is used to edit a card set in the flashcard app.
// The component includes fields for the set name, category, description, and privacy settings.
// It also includes buttons to save changes, cancel editing, and delete the set if the user is the creator.
// The component handles the update action and updates the card set in the parent component.

const MAX_CHAR_LIMIT = 255;

const EditCardSet = ({
  cardSet,
  setCardSet,
  setLoading,
  setIsModalOpen,
  setDeleteWhat,
  setIsCopyModalOpen,
  categories,
  id,
  isCreator,
  favorite,
  setFavorite,
  cardCount,
}: {
  cardSet: CardSet | null;
  setCardSet: React.Dispatch<React.SetStateAction<CardSet | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteWhat: React.Dispatch<React.SetStateAction<string>>;
  setIsCopyModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categories: string[];
  id: string;
  isCreator: boolean;
  favorite: boolean;
  setFavorite: React.Dispatch<React.SetStateAction<boolean>>;
  cardCount: number;
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState(true);
  const [editingSet, setEditingSet] = useState(false);

  const handleUpdateSet = async () => {
    const response = await updateSet(id, name, category, description, privacy);
    if (response instanceof Error) {
      alert(response.message);
    } else {
      setCardSet({
        ...cardSet!,
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        privacy: privacy,
      });
      setName("");
      setDescription("");
      setCategory("");
      setPrivacy(true);
      setEditingSet(false);
    }
  };

  const handleUpdateFavorite = async () => {
    setLoading(true);
    const bool = favorite ? false : true;
    setFavorite(bool);
    const response = await updateSetFavorite(id, bool);
    if (response instanceof Error) {
      alert(response.message);
    }
    setLoading(false);
  };

  return (
    <>
      {isCreator && editingSet ? (
        <>
          <h1 className="text-2xl text-black font-bold">
            Edit {cardSet?.name}
          </h1>
          <div className="border-t-2 border-gray-300 w-full my-2"></div>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <label className="text-black font-semibold gap-2 flex items-center">
              Name
              <input
                type="text"
                value={name}
                onChange={(e) =>
                  handleChange(e.target.value, setName, MAX_CHAR_LIMIT)
                }
                placeholder="Set New Name"
                className="p-2 border rounded text-black font-normal"
              />
            </label>
            <label
              htmlFor="category"
              className="text-black font-semibold gap-2 flex items-center"
            >
              Category
              <select
                id="category"
                value={category}
                onChange={(e) =>
                  handleChange(e.target.value, setCategory, MAX_CHAR_LIMIT)
                }
                className="p-2 border rounded text-black font-normal"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-black font-semibold gap-2 flex items-center">
              Description
              <textarea
                value={description}
                onChange={(e) =>
                  handleChange(e.target.value, setDescription, MAX_CHAR_LIMIT)
                }
                placeholder="Set New Description"
                className="p-2 border rounded text-black font-normal resize-none"
                style={{
                  resize: "vertical",
                  overflowWrap: "break-word",
                  minHeight: "50px",
                }}
              />
            </label>
            <label className="text-black font-semibold gap-2 flex items-center">
              Private Set
              <input
                type="checkbox"
                checked={privacy}
                onChange={() => setPrivacy(!privacy)}
              />
            </label>
          </div>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md enabled:hover:bg-green-600"
            disabled={
              !name.trim() ||
              !category.trim() ||
              !description.trim() ||
              (name === cardSet?.name &&
                category === cardSet?.category &&
                privacy === cardSet?.privacy &&
                description === cardSet?.description)
            }
            onClick={() => handleUpdateSet()}
          >
            Save Changes
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 ml-2"
            onClick={() => {
              setEditingSet(false);
            }}
          >
            Cancel
          </button>
          <div className="border-t-2 border-gray-300 w-full my-2"></div>
        </>
      ) : (
        <>
          <h1 className="text-2xl text-black font-bold mb-2">
            {cardSet?.name}
          </h1>
          <div className="border-t-2 border-gray-300 w-full my-2"></div>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-gray-600">Created by: {cardSet?.creator}</p>
              <p className="text-gray-600">Category: {cardSet?.category}</p>
              <p className="text-gray-600">
                Created at: {cardSet?.creationDate}
              </p>
            </div>
            {isCreator && (
              <button
                type="button"
                title="Edit Set"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={() => {
                  setEditingSet(true);
                  setName(cardSet?.name || "");
                  setCategory(cardSet?.category || "");
                  setDescription(cardSet?.description || "");
                  setPrivacy(cardSet?.privacy !== undefined ? cardSet?.privacy : true);
                }}
              >
                <Image src="/edit.png" alt="Edit" width={20} height={20} />
              </button>
            )}
            {!isCreator && (
              <button
                type="button"
                title="Copy Set"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={() => setIsCopyModalOpen(true)}
              >
                Copy Set
              </button>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="space-y-2">
              <label className="text-gray-600">
                Add To Favorites:
                <input
                  type="checkbox"
                  className="ml-4"
                  checked={favorite}
                  onChange={() => handleUpdateFavorite()}
                />
              </label>
              <p className="text-gray-600">
                {cardSet?.privacy ? "Private Set" : "Public Set"}
              </p>
              <p className="text-gray-600">
                {cardCount} {cardCount === 1 ? "Card" : "Cards"}
              </p>
            </div>
            {isCreator && (
              <button
                type="button"
                title="Delete Set"
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 ml-2"
                onClick={() => {
                  setIsModalOpen(true);
                  setDeleteWhat("set");
                }}
              >
                <Image
                  src="/trash-bin.png"
                  alt="Delete"
                  width={20}
                  height={20}
                />
              </button>
            )}
            {!isCreator && (
              <a
                href={process.env.NEXT_PUBLIC_CARD_SET_REPORT_URL}
                target="_blank"
                rel="noopener"
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                title="Report Set or Creator"
              >
                Report
              </a>
            )}
          </div>
          <div className="border-t-2 border-gray-300 w-full my-2"></div>
          <p className="text-gray-800">{cardSet?.description}</p>
        </>
      )}
    </>
  );
};

export default EditCardSet;
