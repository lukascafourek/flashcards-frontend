"use client";

export const createCard = async (
  front: string,
  back: string,
  setId: string,
  picture: string | null
) => {
  try {
    const response = await fetch(
      `http://localhost:8080/card-sets/${setId}/cards/create`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
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
      throw new Error("Failed to create card.");
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
      `http://localhost:8080/card-sets/${setId}/cards/update/${cardId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
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
      throw new Error("Failed to update card.");
    }
  } catch (error) {
    return error as Error;
  }
};

export const deleteCard = async (setId: string, cardId: string) => {
  try {
    const response = await fetch(
      `http://localhost:8080/card-sets/${setId}/cards/delete/${cardId}`,
      {
        method: "DELETE",
        credentials: "include",
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
