"use client";

// This file contains functions to interact with the backend API for card operations.
// It includes functions to create, update, delete, and fetch cards from a specific card set.

export const createCard = async (
  front: string,
  back: string,
  setId: string,
  picture: string | null
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/card-sets/${setId}/cards/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          front: front,
          back: back,
          picture: picture,
        }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.text();
      throw new Error(errorData);
    }
  } catch (error) {
    return error as Error;
  }
};

export const updateCard = async (
  setId: string,
  cardId: string,
  front: string,
  back: string,
  picture: string | null
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/card-sets/${setId}/cards/update/${cardId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          front: front,
          back: back,
          picture: picture,
        }),
      }
    );
    if (response.ok) {
      return null;
    } else {
      const errorData = await response.text();
      throw new Error(errorData);
    }
  } catch (error) {
    return error as Error;
  }
};

export const deleteCard = async (setId: string, cardId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/card-sets/${setId}/cards/delete/${cardId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      }
    );
    if (response.ok) {
      return null;
    } else {
      throw new Error("Failed to delete card.");
    }
  } catch (error) {
    return error as Error;
  }
};

export const getCards = async (setId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/card-sets/${setId}/cards/get-cards`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.text();
      throw new Error(errorData);
    }
  } catch (error) {
    return error as Error;
  }
};
