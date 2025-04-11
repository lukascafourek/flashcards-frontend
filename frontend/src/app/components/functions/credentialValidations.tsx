"use client";

// This file contains functions to validate user credentials such as email, username, and password.

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) && email.length > 0) {
    return "Invalid email format ❌";
  }
  return "";
};

export const validateUsername = (username: string) => {
  if (username.length < 3 && username.length > 0) {
    return "Username must be at least 3 characters ❌";
  }
  return "";
};

export const checkPasswords = (pass: string, confirmPass: string) => {
  if (pass.length < 8 && pass.length > 0) {
    return "Password must be at least 8 characters ❌";
  }
  if (pass && confirmPass) {
    if (pass !== confirmPass) {
      return "Passwords do not match ❌";
    }
  }
  return "";
};
