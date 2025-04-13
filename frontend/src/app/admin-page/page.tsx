"use client";

import { useState } from "react";
import Image from "next/image";
import {
  getUsers,
  updateUserUsername,
  deleteUser,
  getCardSets,
  getCards,
} from "../components/fetches/adminFetches";
import { deleteSet, updateSet } from "../components/fetches/cardSetFetches";
import { deleteCard, updateCard } from "../components/fetches/cardFetches";
import AuthProvider from "../context/authContext";
import Footer from "../components/elements/footer";
import Header from "../components/elements/header";

interface User {
  id: string;
  email: string;
  username: string;
  provider: string;
  role: string;
  numberOfImages: number;
}

interface CardSet {
  id: string;
  name: string;
  category: string;
  creationDate: string;
  description: string;
  privacy: boolean;
  userId: string;
}

interface Card {
  id: string;
  front: string;
  back: string;
  mimeType: string | null;
  picture: string | null;
  cardSetId: string;
}

// This is the main admin page component. It allows the admin to view and manage users, card sets, and cards.
// It fetches data from the server and displays it in tables. The admin can also update or delete users, card sets, and cards.
export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [cardSets, setCardSets] = useState<CardSet[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [value, setValue] = useState<string>("");

  const handleGetUsers = async () => {
    const response = await getUsers();
    if (response instanceof Error) {
      alert("Error fetching users: " + response.message);
    } else {
      setUsers(response);
      setCardSets([]);
      setCards([]);
    }
  };

  const handleGetCardSets = async () => {
    const response = await getCardSets();
    if (response instanceof Error) {
      alert("Error fetching card sets: " + response.message);
    } else {
      setCardSets(response);
      setUsers([]);
      setCards([]);
    }
  };

  const handleGetCards = async () => {
    const response = await getCards();
    if (response instanceof Error) {
      alert("Error fetching cards: " + response.message);
    } else {
      setCards(response);
      setUsers([]);
      setCardSets([]);
    }
  };

  const handleUpdateUser = async (email: string, newUsername: string) => {
    const response = await updateUserUsername(email, newUsername);
    if (response instanceof Error) {
      alert("Error updating user: " + response.message);
    } else {
      handleGetUsers();
    }
  };

  const handleUpdateCardSet = async (
    id: string,
    name: string,
    category: string,
    description: string,
    privacy: boolean
  ) => {
    const response = await updateSet(id, name, category, description, privacy);
    if (response instanceof Error) {
      alert("Error updating card set: " + response.message);
    } else {
      handleGetCardSets();
    }
  };

  const handleUpdateCard = async (
    id: string,
    cardId: string,
    question: string,
    answer: string,
    image: string | null
  ) => {
    const response = await updateCard(id, cardId, question, answer, image);
    if (response instanceof Error) {
      alert("Error updating card: " + response.message);
    } else {
      handleGetCards();
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const response = await deleteUser(userId);
    if (response instanceof Error) {
      alert("Error deleting user: " + response.message);
    } else {
      handleGetUsers();
    }
  };

  const handleDeleteCardSet = async (id: string) => {
    const response = await deleteSet(id);
    if (response instanceof Error) {
      alert("Error deleting card set: " + response.message);
    } else {
      handleGetCardSets();
    }
  };

  const handleDeleteCard = async (id: string, cardId: string) => {
    const response = await deleteCard(id, cardId);
    if (response instanceof Error) {
      alert("Error deleting card: " + response.message);
    } else {
      handleGetCards();
    }
  };

  const Render = () => {
    return (
      <div className="flex flex-col min-h-screen bg-gray-200 text-black md:text-xl">
        {/* Header */}
        <Header />
        <div className="p-4 flex flex-grow">
          <h1 className="text-2xl font-bold mb-4">Admin Page</h1>

          {/* Dropdown to select data to view */}
          <label htmlFor="data-select" className="block mb-2 font-semibold">
            Select Data to View:
          </label>
          <select
            value={value}
            id="data-select"
            onChange={(e) => {
              const value = e.target.value;
              setValue(value);
              if (value === "users") {
                handleGetUsers();
              } else if (value === "cardSets") {
                handleGetCardSets();
              } else if (value === "cards") {
                handleGetCards();
              } else {
                setUsers([]);
                setCardSets([]);
                setCards([]);
              }
            }}
            className="mb-4 p-2 border rounded"
          >
            <option value="">Select an option</option>
            <option value="users">Users</option>
            <option value="cardSets">Card Sets</option>
            <option value="cards">Cards</option>
          </select>

          {/* Buttons to refresh data or exit the admin page */}
          <button
            onClick={() => {
              if (value === "users") {
                handleGetUsers();
              } else if (value === "cardSets") {
                handleGetCardSets();
              } else if (value === "cards") {
                handleGetCards();
              }
            }}
            className="mb-4 p-2 bg-blue-500 text-white rounded ml-4 hover:bg-blue-600"
          >
            Refresh Data
          </button>
          <button
            onClick={() => {
              window.location.href = "/collections";
            }}
            className="mb-4 p-2 bg-gray-500 text-white rounded ml-4 hover:bg-gray-600"
          >
            Exit Admin Page
          </button>

          {/* Displaying the data in tables based on the selected option */}
          <div className="overflow-x-auto mb-4">
            {users.length > 0 && (
              <table className="table-auto border-collapse border border-gray-400 w-full mb-4">
                <thead>
                  <tr>
                    <th className="border border-gray-400 px-4 py-2">ID</th>
                    <th className="border border-gray-400 px-4 py-2">Email</th>
                    <th className="border border-gray-400 px-4 py-2">
                      Username
                    </th>
                    <th className="border border-gray-400 px-4 py-2">
                      Provider
                    </th>
                    <th className="border border-gray-400 px-4 py-2">Role</th>
                    <th className="border border-gray-400 px-4 py-2">
                      Number Of Images
                    </th>
                    <th className="border border-gray-400 px-4 py-2">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="border border-gray-400 px-4 py-2">
                        {user.id}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {user.email}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {user.username}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {user.provider}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {user.role}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {user.numberOfImages}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        <button
                          onClick={() =>
                            handleUpdateUser(
                              user.email,
                              prompt("Enter new username:", user.username) ||
                                user.username
                            )
                          }
                          className="mr-2 p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {cardSets.length > 0 && (
              <table className="table-auto border-collapse border border-gray-400 w-full mb-4">
                <thead>
                  <tr>
                    <th className="border border-gray-400 px-4 py-2">ID</th>
                    <th className="border border-gray-400 px-4 py-2">Name</th>
                    <th className="border border-gray-400 px-4 py-2">
                      Category
                    </th>
                    <th className="border border-gray-400 px-4 py-2">
                      Description
                    </th>
                    <th className="border border-gray-400 px-4 py-2">
                      Privacy
                    </th>
                    <th className="border border-gray-400 px-4 py-2">
                      Owner ID
                    </th>
                    <th className="border border-gray-400 px-4 py-2">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cardSets.map((set) => (
                    <tr key={set.id}>
                      <td className="border border-gray-400 px-4 py-2">
                        {set.id}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {set.name}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {set.category}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {set.description}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {set.privacy ? "Private" : "Public"}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {set.userId}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        <button
                          onClick={() =>
                            handleUpdateCardSet(
                              set.id,
                              prompt("Enter new name:", set.name) || set.name,
                              prompt("Enter new category:", set.category) ||
                                set.category,
                              prompt(
                                "Enter new description:",
                                set.description
                              ) || set.description,
                              confirm("Set privacy to private?") ? true : false
                            )
                          }
                          className="mr-2 p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteCardSet(set.id)}
                          className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {cards.length > 0 && (
              <table className="table-auto border-collapse border border-gray-400 w-full mb-4">
                <thead>
                  <tr>
                    <th className="border border-gray-400 px-4 py-2">ID</th>
                    <th className="border border-gray-400 px-4 py-2">
                      Question
                    </th>
                    <th className="border border-gray-400 px-4 py-2">Answer</th>
                    <th className="border border-gray-400 px-4 py-2">Set ID</th>
                    <th className="border border-gray-400 px-4 py-2">
                      Mime Type
                    </th>
                    <th className="border border-gray-400 px-4 py-2">Image</th>
                    <th className="border border-gray-400 px-4 py-2">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((card) => (
                    <tr key={card.id}>
                      <td className="border border-gray-400 px-4 py-2">
                        {card.id}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {card.front}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {card.back}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {card.cardSetId}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {card.mimeType}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {card.picture && card.mimeType && (
                          <Image
                            src={`data:${card.mimeType};base64,${card.picture}`}
                            alt="Card Image"
                            className="max-w-32 max-h-32 center mx-auto my-auto"
                            width={500}
                            height={500}
                          />
                        )}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        <button
                          onClick={() =>
                            handleUpdateCard(
                              card.cardSetId,
                              card.id,
                              prompt("Enter new question:", card.front) ||
                                card.front,
                              prompt("Enter new answer:", card.back) ||
                                card.back,
                              confirm("Do you want to delete the image?")
                                ? null
                                : card.picture
                            )
                          }
                          className="mr-2 p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Update
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteCard(card.cardSetId, card.id)
                          }
                          className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
