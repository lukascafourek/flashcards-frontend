"use client";

import Cookies from "js-cookie";

// This file contains functions to fetch data from the backend for admin functionalities.
// It includes functions to get all users, update a user's username, delete a user, get all card sets, and get all cards.

export const checkIsAdmin = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/is-admin`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${Cookies.get('jwt')}` },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const message = await response.text();
      throw new Error(message);
    }
  } catch (error) {
    return error as Error;
  }
};

export const getUsers = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/get-all-users`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${Cookies.get('jwt')}` },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const message = await response.text();
      throw new Error(message);
    }
  } catch (error) {
    return error as Error;
  }
};

export const updateUserUsername = async (
  email: string,
  newUsername: string
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/update-user/${email}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get('jwt')}`,
        },
        body: JSON.stringify({ username: newUsername }),
      }
    );
    if (response.ok) {
      return null;
    } else {
      const message = await response.text();
      throw new Error(message);
    }
  } catch (error) {
    return error as Error;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/delete-account/${userId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${Cookies.get('jwt')}` },
      }
    );
    if (response.ok) {
      return null;
    } else {
      const message = await response.text();
      throw new Error(message);
    }
  } catch (error) {
    return error as Error;
  }
};

export const getCardSets = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/card-sets/get-all`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${Cookies.get('jwt')}` },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const message = await response.text();
      throw new Error(message);
    }
  } catch (error) {
    return error as Error;
  }
};

export const getCards = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/card-sets/get-cards`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${Cookies.get('jwt')}` },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const message = await response.text();
      throw new Error(message);
    }
  } catch (error) {
    return error as Error;
  }
};
