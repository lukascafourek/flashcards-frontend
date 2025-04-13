"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/app/components/elements/header";
import AuthProvider from "../context/authContext";
import Footer from "../components/elements/footer";
import Link from "next/link";
import { LoadingSpinner, LoadingSpinnerSmall } from "../components/elements/loadingCircle";
import { getSets } from "../components/fetches/cardSetFetches";
import { handleChange } from "../components/functions/inputValidation";
import { useAuth } from "../hooks/useAuth";
import CardSetModalCreate from "../components/elements/cardSetModalCreate";

const MAX_CHAR_LIMIT = 255;

interface CardSet {
  id: string;
  name: string;
  category: string;
  creationDate: string;
  creator: string;
}

// This is the main component for the Collections page which is displayed when the user is logged in.
// It fetches the collections from the server and displays them in a grid format. The user can filter and sort the collections based on different criteria.
// The user can also create a new collection using the modal provided in this component.
export default function Collections() {
  const Render = () => {
    const { authChecked } = useAuth();
    const [categories, setCategories] = useState<string[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const sortBy = searchParams.get("sortBy") || "creationDate";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const selectedCategory = searchParams.get("category") || "";
    const searchQuery = searchParams.get("search") || "";
    const myCollections = searchParams.get("myCollections") === "true";
    const myFavorites = searchParams.get("myFavorites") === "true";
    const itemsPerPage = window.innerWidth < 1024 ? 10 : 20;
    const [totalPages, setTotalPages] = useState(1);
    const [searchInput, setSearchInput] = useState(searchQuery);
    const [collections, setCollections] = useState<CardSet[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(collections === null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

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

    const getCollections = useCallback(async () => {
      const response = await getSets(
        currentPage,
        itemsPerPage,
        sortBy,
        sortOrder,
        selectedCategory,
        searchQuery,
        myCollections,
        myFavorites
      );
      if (response instanceof Error) {
        return response.message;
      } else {
        setTotalPages(response.pages);
        setCategories(response.categories);
        setCollections(response.cardSets);
        return null;
      }
    }, [
      currentPage,
      itemsPerPage,
      sortBy,
      sortOrder,
      selectedCategory,
      searchQuery,
      myCollections,
      myFavorites,
    ]);

    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    useEffect(() => {
      if (!authChecked) return;
      window.addEventListener("resize", checkScreenWidth);
      if (!collections) {
        getCollections()
          .then((error) => setError(error || ""))
          .finally(() => setLoading(false));
      }
      return () => {
        window.removeEventListener("resize", checkScreenWidth);
      };
    }, [collections, getCollections, authChecked]);

    if (!authChecked) return <LoadingSpinner />;
    return (
      <div className="min-h-screen bg-gray-200 flex flex-col md:text-xl">
        {/* Header */}
        <Header />

        {/* Welcome Text */}
        <div className="bg-gray-900 text-xl text-white text-center py-10">
          This is the Collections Page where you can browse through all
          collections and filter them.
        </div>

        {/* Sorting and Filtering Options */}
        <div className="container mx-auto p-5 flex flex-wrap items-center gap-4 text-black">
          <label className="rounded-md border text-black">
            My Collections:
            <input
              type="checkbox"
              className="ml-2"
              checked={myCollections}
              onChange={() =>
                updateFilters("myCollections", myCollections ? "" : "true")
              }
              disabled={loading}
            />
          </label>
          <label className="rounded-md border text-black">
            Favorite Collections:
            <input
              type="checkbox"
              className="ml-2"
              checked={myFavorites}
              onChange={() =>
                updateFilters("myFavorites", myFavorites ? "" : "true")
              }
              disabled={loading}
            />
          </label>
          <label htmlFor="selectCategory" className="sr-only">
            Categories:
          </label>
          <select
            id="selectCategory"
            className="px-4 py-2 border rounded-md"
            value={selectedCategory}
            onChange={(e) => updateFilters("category", e.target.value)}
            disabled={loading}
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
            className="px-4 py-2 border rounded-md w-68"
            placeholder="Search by card set name..."
            value={searchInput}
            onChange={(e) =>
              handleChange(e.target.value, setSearchInput, MAX_CHAR_LIMIT)
            }
            onKeyDown={handleSearchEnter}
            disabled={loading}
          />
          <label htmlFor="sortBy" className="sr-only">
            Sort by:
          </label>
          <select
            id="sortBy"
            className="px-4 py-2 border rounded-md"
            value={sortBy}
            onChange={(e) => updateFilters("sortBy", e.target.value)}
            disabled={loading}
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
            disabled={loading}
          >
            {sortOrder === "asc" ? "⬆ Ascending" : "⬇ Descending"}
          </button>
          <button
            className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
              loading ||
              (!myCollections &&
                !myFavorites &&
                selectedCategory === "" &&
                searchQuery === "" &&
                sortBy === "creationDate" &&
                sortOrder === "desc")
                ? ""
                : "hover:bg-blue-500"
            }`}
            onClick={resetFilters}
            disabled={
              loading ||
              (!myCollections &&
                !myFavorites &&
                selectedCategory === "" &&
                searchQuery === "" &&
                sortBy === "creationDate" &&
                sortOrder === "desc")
            }
          >
            Reset Filters
          </button>
        </div>

        {/* Collections Grid */}
        {loading ? (
          <div className="flex-grow flex items-center justify-center">
            <LoadingSpinnerSmall />
          </div>
        ) : (
          <>
            <div className="container mx-auto p-4 flex-grow">
              {error !== null && error !== "" ? (
                <p className="text-center text-red-600 flex-grow">{error}</p>
              ) : (
                <>
                  {paginatedCollections.length > 0 ? (
                    <div
                      className={`grid ${
                        isMobile ? "grid-cols-2 gap-2" : "grid-cols-4 gap-4"
                      }`}
                    >
                      {paginatedCollections.map((collection) => (
                        <Link
                          key={collection.id}
                          href={`/collections/${collection.id}`}
                          className="block"
                        >
                          <div className="bg-white p-4 shadow-lg rounded-xl cursor-pointer hover:shadow-xl transition-all">
                            <h2 className="md:text-2xl text-lg text-black font-semibold">
                              {collection.name}
                            </h2>
                            <p className="md:text-lg text-sm text-gray-600">
                              Category: {collection.category}
                            </p>
                            <p className="md:text-lg text-sm text-gray-600">
                              Creator: {collection.creator}
                            </p>
                            <p className="md:text-lg text-sm text-gray-600">
                              Created: {collection.creationDate}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600 flex-grow">
                      No collections found.
                    </p>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {/* Pagination */}
        <div className="flex justify-center space-x-2 my-5 md:text-xl sm:text-lg text-sm">
          <button
            className={`${
              isMobile ? "px-3 py-2" : "px-4 py-2"
            } bg-gray-800 text-white rounded-md`}
            onClick={() => updateFilters("page", "1")}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            className={`${
              isMobile ? "px-3 py-2" : "px-4 py-2"
            } bg-gray-800 text-white rounded-md`}
            onClick={() => updateFilters("page", (currentPage - 1).toString())}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span
            className={`${
              isMobile ? "px-3 py-2" : "px-4 py-2"
            } text-black bg-gray-300 rounded-md`}
          >
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={`${
              isMobile ? "px-3 py-2" : "px-4 py-2"
            } bg-gray-800 text-white rounded-md`}
            onClick={() => updateFilters("page", (currentPage + 1).toString())}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            className={`${
              isMobile ? "px-3 py-2" : "px-4 py-2"
            } bg-gray-800 text-white rounded-md`}
            onClick={() => updateFilters("page", totalPages.toString())}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>

        {/* Create Card Set Modal */}
        <CardSetModalCreate
          categories={categories}
          router={router}
          MAX_CHAR_LIMIT={MAX_CHAR_LIMIT}
        />

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
