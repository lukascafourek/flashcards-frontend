"use client";

export const createSet = async (setName: string, category: string) => {
  try {
    const response = await fetch("http://localhost:8080/card-sets/create", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: setName.trim(),
        category: category.trim(),
        favorite: false,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      return data.id;
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
    const response = await fetch(
      `http://localhost:8080/card-sets/get-sets?
          page=${encodeURIComponent(currentPage)}&
          size=${encodeURIComponent(itemsPerPage)}&
          sortBy=${encodeURIComponent(sortBy)}&
          order=${encodeURIComponent(sortOrder)}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: selectedCategory !== "" ? selectedCategory : null,
          search: searchQuery !== "" ? searchQuery : null,
          mySets: mySets,
          myFavorites: myFavorites,
        }),
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
    const response = await fetch(
      `http://localhost:8080/card-sets/get/${setId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
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
  favorite: boolean
) => {
  try {
    const response = await fetch(
      `http://localhost:8080/card-sets/update/${setId}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: setName.trim() !== "" ? setName.trim() : null,
          category: category.trim() !== "" ? category.trim() : null,
          favorite: favorite,
        }),
        keepalive: true,
      }
    );
    if (response.ok) {
      return null;
    } else {
      throw new Error("Failed to update card set.");
    }
  } catch (error) {
    return error as Error;
  }
};

export const deleteSet = async (setId: string) => {
  try {
    const response = await fetch(
      `http://localhost:8080/card-sets/delete/${setId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    if (response.ok) {
      return null;
    } else {
      throw new Error("Failed to delete card set.");
    }
  } catch (error) {
    return error as Error;
  }
};
