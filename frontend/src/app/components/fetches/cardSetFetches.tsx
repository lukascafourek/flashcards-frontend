"use client";

import { Card } from "@/app/collections/[id]/page";
import { BACKEND } from "../../page";

// This file contains functions to interact with the backend API for card set operations.
// It includes functions to create, update, delete, and fetch card sets.

export const createSet = async (
  setName: string,
  category: string,
  description: string
) => {
  try {
    const response = await fetch(`${BACKEND}/card-sets/create`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: setName.trim(),
        description: description.trim(),
        category: category.trim(),
        favorite: false,
        privacy: true,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("There was an issue with the request. Please try again.");
    }
  } catch (error) {
    return error as Error;
  }
};

export const copySet = async (setId: string) => {
  try {
    const response = await fetch(`${BACKEND}/card-sets/copy/${setId}`, {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("There was an issue with the request. Please try again.");
    }
  } catch (error) {
    return error as Error;
  }
};

export const getSets = async (
  currentPage: number,
  itemsPerPage: number,
  sortBy: string,
  sortOrder: string,
  selectedCategory: string,
  searchQuery: string,
  mySets: boolean,
  myFavorites: boolean
) => {
  try {
    const queryParams = new URLSearchParams({
      page: currentPage.toString(),
      size: itemsPerPage.toString(),
      sortBy: sortBy,
      order: sortOrder,
      category: selectedCategory !== "" ? selectedCategory : "",
      search: searchQuery !== "" ? searchQuery : "",
      mySets: mySets.toString(),
      myFavorites: myFavorites.toString(),
    });

    const response = await fetch(
      `${BACKEND}/card-sets/get-sets?${queryParams.toString()}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("There was an issue with the request. Please try again.");
    }
  } catch (error) {
    return error as Error;
  }
};

export const fetchSet = async (setId: string) => {
  try {
    const response = await fetch(`${BACKEND}/card-sets/get/${setId}`, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch card set.");
    }
  } catch (error) {
    return error as Error;
  }
};

export const updateSet = async (
  setId: string,
  setName: string,
  category: string,
  description: string,
  privacy: boolean
) => {
  try {
    const response = await fetch(`${BACKEND}/card-sets/update/${setId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: setName.trim() !== "" ? setName.trim() : null,
        description: description.trim() !== "" ? description.trim() : null,
        category: category.trim() !== "" ? category.trim() : null,
        privacy: privacy,
      }),
      keepalive: true,
    });
    if (response.ok) {
      return null;
    } else {
      throw new Error("Failed to update card set.");
    }
  } catch (error) {
    return error as Error;
  }
};

export const updateSetFavorite = async (setId: string, favorite: boolean) => {
  try {
    const response = await fetch(
      `${BACKEND}/card-sets/update-favorite/${setId}?isFavorite=${encodeURIComponent(
        favorite
      )}`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );
    if (response.ok) {
      return null;
    } else {
      throw new Error("Failed to update card set favorite status.");
    }
  } catch (error) {
    return error as Error;
  }
};

export const updateCardOrder = async (setId: string, cards: Card[]) => {
  try {
    const response = await fetch(
      `${BACKEND}/card-sets/${setId}/update-card-order`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cards }),
      }
    );
    if (response.ok) {
      return null;
    } else {
      throw new Error("Failed to update card order.");
    }
  } catch (error) {
    return error as Error;
  }
};

export const deleteSet = async (setId: string) => {
  try {
    const response = await fetch(`${BACKEND}/card-sets/delete/${setId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (response.ok) {
      return null;
    } else {
      throw new Error("Failed to delete card set.");
    }
  } catch (error) {
    return error as Error;
  }
};
