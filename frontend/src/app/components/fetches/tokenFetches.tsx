"use client";

// This file contains functions to handle password reset operations.
// It includes functions to request a password reset token, verify the token, and reset the password.

export const handleRequest = async (email: string) => {
  try {
    const tokenResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/token/request-reset`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );
    if (tokenResponse.ok) {
      return null;
    } else {
      const message = await tokenResponse.text();
      throw new Error(message);
    }
  } catch (error) {
    return (error as Error).message;
  }
};

export const verifyToken = async (email: string, token: string) => {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/token/verify?email=${encodeURIComponent(
        email
      )}&token=${encodeURIComponent(token)}`,
      {
        method: "GET",
      }
    );
    if (response.ok) {
      return null;
    } else {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
  } catch (error) {
    return (error as Error).message;
  }
};

export const resetPassword = async (email: string, password: string) => {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/auth/reset-password?email=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}`,
      {
        method: "PATCH",
      }
    );
    if (response.ok) {
      return null;
    } else {
      const message = await response.text();
      throw new Error(message);
    }
  } catch (error) {
    return (error as Error).message;
  }
};
