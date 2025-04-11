"use client";

// This file contains functions to validate user input in forms, such as limiting the number of characters in a text field.

export const handleChange = (
  value: string,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  limit: number
) => {
  if (value.length <= limit) {
    setValue(value);
  }
};
