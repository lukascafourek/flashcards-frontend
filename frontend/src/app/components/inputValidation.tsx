"use client";

export const handleChange = (
  value: string,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  limit: number
) => {
  if (value.length <= limit) {
    setValue(value);
  }
};
