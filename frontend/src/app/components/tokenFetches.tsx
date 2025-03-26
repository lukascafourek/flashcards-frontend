"use client";

// export const sendNewToken = async (email: string) => {
//     try {
//         const tokenResponse = await fetch("http://localhost:8080/token/request-reset", {
//             method: "POST",
//             credentials: "include",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ email }),
//         })
//         if (tokenResponse.ok) {
//             return null;
//         } else {
//             throw new Error("There was an issue sending the token. Please try again.");
//         }
//     } catch (error) {
//         return (error as Error).message;
//     }
// };

// export const sendToken = async (email: string) => {
//     try {
//         let errorMessage = null;
//         const response = await fetch(`http://localhost:8080/auth/email-exists?email=${encodeURIComponent(email)}`, {
//             method: "GET",
//             credentials: "include",
//         });
//         if (response.ok) {
//             const exists = await response.json();
//             if (exists) {
//                 errorMessage = handleRequest(email);
//             } else {
//                 throw new Error("Email not found ❌");
//             }
//             return errorMessage;
//         } else {
//             throw new Error("There was an issue with the request. Please try again.");
//         }
//     } catch (error) {
//         return (error as Error).message;
//     }
// };

export const handleRequest = async (email: string) => {
  try {
    const tokenResponse = await fetch(
      "http://localhost:8080/token/request-reset",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
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
      `http://localhost:8080/token/verify?email=${encodeURIComponent(
        email
      )}&token=${encodeURIComponent(token)}`,
      {
        method: "GET",
        credentials: "include",
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
      `http://localhost:8080/auth/reset-password?email=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}`,
      {
        method: "PUT",
        credentials: "include",
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
