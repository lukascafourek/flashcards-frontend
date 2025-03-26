"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/app/components/header";
import AuthProvider from "../context/authContext";
import Footer from "../components/footer";
import Link from "next/link";
import { LoadingSpinnerSmall } from "../components/loadingCircle";
import { createSet, getSets } from "../components/cardSetFetches";

interface CardSet {
  id: string;
  name: string;
  category: string;
  creationDate: string;
  creator: string;
}

export default function Collections() {
  const Render = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const sortBy = searchParams.get("sortBy") || "creationDate";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const selectedCategory = searchParams.get("category") || "";
    const searchQuery = searchParams.get("search") || "";
    const itemsPerPage = 20;
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [setName, setSetName] = useState("");
    const [category, setCategory] = useState("");
    const [searchInput, setSearchInput] = useState(searchQuery);
    const [collections, setCollections] = useState<CardSet[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const sortedCollections = [...(collections || [])].sort((a, b) => {
      if (sortBy === "name")
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      if (sortBy === "category")
        return sortOrder === "asc"
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      return sortOrder === "asc"
        ? a.creationDate.localeCompare(b.creationDate)
        : b.creationDate.localeCompare(a.creationDate);
    });

    const filteredCollections = sortedCollections.filter((collection) => {
      const matchesCategory = selectedCategory
        ? collection.category === selectedCategory
        : true;
      const matchesSearch = collection.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    const paginatedCollections = filteredCollections.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    const updateFilters = (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (key === "page" && Number(value) >= 1 && Number(value) <= totalPages) {
        params.set(key, value);
      } else {
        params.set("page", "1");
      }
      params.set("sortBy", key === "sortBy" ? value : sortBy);
      params.set("sortOrder", key === "sortOrder" ? value : sortOrder);
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`?${params.toString()}`);
    };

    const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        updateFilters("search", searchInput);
      }
    };

    const resetFilters = () => {
      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("sortBy", "creationDate");
      params.set("sortOrder", "desc");
      router.push(`?${params.toString()}`);
    };

    const getCollections = async () => {
      const response = await getSets(
        currentPage,
        itemsPerPage,
        sortBy,
        sortOrder,
        selectedCategory,
        searchQuery
      );
      if (response instanceof Error) {
        return response.message;
      } else {
        setTotalPages(response.pages);
        setCategories(response.categories);
        setCollections(response.cardSets);
        return null;
      }
    };

    const handleCreateSet = async () => {
      const response = await createSet(setName, category);
      if (response instanceof Error) {
        alert(response.message);
      } else {
        setIsModalOpen(false);
        router.push(`/collections/${response}`);
      }
    };

    useEffect(() => {
      if (!collections) {
        getCollections()
          .then((error) => setError(error || ""))
          .finally(() => setLoading(false));
      }
    });

    return (
      <div className="min-h-screen bg-gray-200 flex flex-col">
        {/* Header */}
        <Header />

        {/* Welcome Text */}
        <div className="bg-gray-900 text-xl text-white text-center py-10">
          This is the Collections Page where you can browse through all the
          collections and filter them.
        </div>

        {/* Sorting and Filtering Options */}
        <div className="container mx-auto p-5 flex flex-wrap items-center gap-4 text-black">
          <label htmlFor="selectCategory" className="sr-only">
            Categories:
          </label>
          <select
            id="selectCategory"
            className="px-4 py-2 border rounded-md"
            value={selectedCategory}
            onChange={(e) => updateFilters("category", e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="px-4 py-2 border rounded-md w-1/3"
            placeholder="Search by card set name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchEnter}
          />
          <label htmlFor="sortBy" className="sr-only">
            Sort by:
          </label>
          <select
            id="sortBy"
            className="px-4 py-2 border rounded-md"
            value={sortBy}
            onChange={(e) => updateFilters("sortBy", e.target.value)}
          >
            <option value="creationDate">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="category">Sort by Category</option>
          </select>
          <button
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-600"
            onClick={() =>
              updateFilters("sortOrder", sortOrder === "asc" ? "desc" : "asc")
            }
          >
            {sortOrder === "asc" ? "⬆ Ascending" : "⬇ Descending"}
          </button>
          <button
            className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
              !selectedCategory &&
              !searchQuery &&
              sortBy === "date" &&
              sortOrder === "desc"
                ? ""
                : "hover:bg-blue-500"
            }`}
            onClick={resetFilters}
            disabled={
              !selectedCategory &&
              !searchQuery &&
              sortBy === "date" &&
              sortOrder === "desc"
            }
          >
            Reset Filters
          </button>
        </div>

        {/* Collections Grid */}
        {loading ? (
          <LoadingSpinnerSmall />
        ) : (
          <>
            <div className="container mx-auto p-4 flex-grow">
              {error !== null ? (
                <p className="text-center text-red-600">{error}</p>
              ) : (
                <>
                  {paginatedCollections.length > 0 ? (
                    <div className="grid grid-cols-5 gap-5">
                      {paginatedCollections.map((collection) => (
                        <Link
                          key={collection.id}
                          href={`/collections/${collection.id}`}
                          className="block"
                        >
                          <div className="bg-white p-4 shadow-lg rounded-xl cursor-pointer hover:shadow-xl transition-all">
                            <h2 className="text-lg text-black font-semibold">
                              {collection.name}
                            </h2>
                            <p className="text-sm text-gray-600">
                              Category: {collection.category}
                            </p>
                            <p className="text-sm text-gray-600">
                              Creator: {collection.creator}
                            </p>
                            <p className="text-sm text-gray-600">
                              Created: {collection.creationDate}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600">
                      No collections found.
                    </p>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {/* Pagination */}
        <div className="flex justify-center space-x-2 my-5">
          <button
            className="px-4 py-2 bg-gray-800 text-white rounded-md"
            onClick={() => updateFilters("page", "1")}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            className="px-4 py-2 bg-gray-800 text-white rounded-md"
            onClick={() => updateFilters("page", (currentPage - 1).toString())}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-black bg-gray-300 rounded-md">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-800 text-white rounded-md"
            onClick={() => updateFilters("page", (currentPage + 1).toString())}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            className="px-4 py-2 bg-gray-800 text-white rounded-md"
            onClick={() => updateFilters("page", totalPages.toString())}
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
              <h2 className="text-xl text-black font-semibold mb-4">
                Create a New Card Set
              </h2>
              <label className="block text-black font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md mb-4 text-black"
                placeholder="Enter card set name"
                value={setName}
                onChange={(e) => setSetName(e.target.value)}
              />
              <label
                htmlFor="category"
                className="block text-black font-medium mb-1"
              >
                Category
              </label>
              <select
                id="category"
                className="w-full p-2 border rounded-md mb-4 text-black"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
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
                  className={`px-4 py-2 bg-green-600 text-white rounded-md transition-all ${
                    !setName.trim() || !category.trim()
                      ? ""
                      : "hover:bg-green-500"
                  }`}
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
