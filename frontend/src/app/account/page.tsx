"use client";

import Header from "@/app/header";
import AuthProvider from "@/app/context/authContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "../hooks/useAuth";
import Footer from "../footer";

export default function ShowAccountInfo() {
  const Render = () => {
    const { user, /*token,*/ updateUsername, updateEmail, updatePassword, deleteAccount } = useAuth();
    const [username, setUsername] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");
    const [editingUsername, setEditingUsername] = useState(false);
    const [usernameError, setUsernameError] = useState("");
    const [editingOther, setEditingOther] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordMatchMessage, setPasswordMatchMessage] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [checkPasswordError, setCheckPasswordError] = useState("");
    const [checkEmailError, setCheckEmailError] = useState("");
    const [editingDelete, setEditingDelete] = useState(false);
    const [deleteEmailError, setDeleteEmailError] = useState("");

    useEffect(() => {
      setUsername(user?.username || "");
      setEmail(user?.email || "");
    } , [user]);

    const validateEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          setEmailError("Invalid email format ❌");
      } else {
          setEmailError("");
      }
    };

    const validateUsername = (username: string) => {
      if (username.length < 3) {
          setUsernameError("Username must be at least 3 characters ❌");
      } else {
          setUsernameError("");
      }
    };

    const checkPasswords = (pass: string, confirmPass: string) => {
      if (pass.length < 8) {
          setPasswordError("Password must be at least 8 characters ❌");
      } else {
          setPasswordError("");
      }

      if (pass && confirmPass) {
          if (pass === confirmPass) {
              setPasswordMatchMessage("Passwords match ✅");
          } else {
              setPasswordMatchMessage("Passwords do not match ❌");
          }
      } else {
          setPasswordMatchMessage("");
      }
    };

    const checkPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await fetch(`http://localhost:8080/auth/check-password?password=${encodeURIComponent(oldPassword)}`, {
          method: "GET",
          // headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setCheckPasswordError("");
            if (newEmail) {
              checkEmail();
            }
            if (newPassword) {
              updatePassword(newPassword);
            }
            setEditingOther(false);
          } else {
            setCheckPasswordError("Incorrect password ❌");
          }
        } else {
          alert("Failed to check password. Please try again.");
        }
      } catch (error) {
        console.error("Failed to check password", error);
      }
    };

    const checkEmail = async () => {
      try {
        const response = await fetch(`http://localhost:8080/auth/email-exists?email=${encodeURIComponent(email)}`, {
            method: "GET",
            credentials: "include",
        });
        if (response.ok) {
            const exists = await response.json();
            if (exists) {
                setCheckEmailError("Email already exists ❌");
            } else {
                setCheckEmailError("");
                updateEmail(newEmail);
            }
        } else {
            alert("Failed to check email. Please try again.");
        }
      } catch (error) {
          console.error("Error checking email:", error);
      }
    }

    return (
      <div className="min-h-screen bg-gray-200">
        {/* Header */}
        <Header />

        {/* Account Info Section */}
        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-center text-black text-xl font-semibold mb-4">Your account</h2>
            <div className="flex items-center mb-2">
              {!editingUsername ? (
                <>
                  <label className="block text-black mr-2 w-full">Username: {username}</label>
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => setEditingUsername(true)}
                  >
                    Edit
                  </button>
                </>
              ) : (
                <>
                  <label className="block text-black mr-2">Username: </label>
                  <input
                    type="text"
                    placeholder="Enter your new username"
                    className="text-black border border-gray-300 rounded px-2 py-1 mr-2 w-full"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      validateUsername(e.target.value);
                    }}
                  />
                  <button
                    type="button"
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    disabled={usernameError !== ""}
                    onClick={() => {
                      updateUsername(username);
                      setEditingUsername(false);
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                    onClick={() => {
                      setUsername(user?.username || "");
                      setEditingUsername(false);
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
            {usernameError && <p className="text-red-500">{usernameError}</p>}

            <label className="block text-black mr-2 mb-2">Email: {email}</label>

            <div className="flex items-center mb-2 mt-8">
              {!editingOther ? (
                <>
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => setEditingOther(true)}
                  >
                    Edit Email or Password
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-black mr-2 font-semibold">Editing both email and password is not necessary.</label>
                    {checkPasswordError && <p className="text-red-500 mb-2">{checkPasswordError}</p>}
                    {checkEmailError && <p className="text-red-500 mb-2">{checkEmailError}</p>}
                    <form onSubmit={checkPassword}>
                      <label className="block text-black mr-2 mt-2">Current password: </label>
                      <div className="relative mb-4">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your current password"
                          className="text-black border border-gray-300 rounded px-2 py-1 mr-2 w-full"
                          onChange={e => setOldPassword(e.target.value)}
                        />
                        <span className="absolute right-3 top-2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                          <Image src="/eye.png" alt="Toggle Password Visibility" width={20} height={20}/>
                        </span>
                      </div>
                      <label className="block text-black mr-2 mt-2">New email: </label>
                      <div className="relative mb-4">
                        <input
                          type="text"
                          placeholder="Enter your new email"
                          className="text-black border border-gray-300 rounded px-2 py-1 mr-2 w-full"
                          onChange={(e) => {
                            setNewEmail(e.target.value);
                            validateEmail(e.target.value);
                          }}
                        />
                      </div>
                      {emailError && <p className="text-red-500">{emailError}</p>}
                      <label className="block text-black mr-2 mt-2">New password: </label>
                      <div className="relative mb-4">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your new password"
                          className="text-black border border-gray-300 rounded px-2 py-1 mr-2 w-full"
                          onChange={e => {
                            setNewPassword(e.target.value);
                            checkPasswords(e.target.value, confirmNewPassword);
                          }}
                        />
                        <span className="absolute right-3 top-2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                          <Image src="/eye.png" alt="Toggle Password Visibility" width={20} height={20}/>
                        </span>
                      </div>
                      {passwordError && <p className="text-red-500">{passwordError}</p>}
                      <label className="block text-black mr-2 mt-2">Confirm new password: </label>
                      <div className="relative mb-4">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your new password again"
                          className="text-black border border-gray-300 rounded px-2 py-1 mr-2 w-full"
                          onChange={e => {
                            setConfirmNewPassword(e.target.value);
                            checkPasswords(newPassword, e.target.value);
                          }}
                        />
                        <span className="absolute right-3 top-2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                          <Image src="/eye.png" alt="Toggle Password Visibility" width={20} height={20}/>
                        </span>
                      </div>
                      {passwordMatchMessage && <p className="text-red-500">{passwordMatchMessage}</p>}
                      <div className="flex mt-2">
                        <button
                          type = "submit"
                          className="bg-green-500 text-white px-2 py-1 rounded"
                          disabled={emailError !== "" || passwordError !== "" || passwordMatchMessage.includes("❌") || (!newEmail && !newPassword && !confirmNewPassword) || !oldPassword}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                          onClick={() => setEditingOther(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center mt-2">
              {!editingDelete ? (
                <>
                  <button
                    type="button"
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => setEditingDelete(true)}
                  >
                    Delete Account
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-black mr-2 font-semibold">Are you sure you want to delete your account?</label>
                    <label className="block text-black mr-2">To delete your account, type your email below.</label>
                    <input
                      type="text"
                      placeholder="Enter your email"
                      className="text-black border border-gray-300 rounded px-2 py-1 mr-2 w-full"
                      onChange={(e) => {
                        if (e.target.value === email) {
                          setDeleteEmailError("");
                        } else {
                          setDeleteEmailError("Email does not match ❌");
                        }
                      }}
                    />
                    {deleteEmailError && <p className="text-red-500 mb-2">{deleteEmailError}</p>}
                    <div className="flex mt-2">
                      <button
                        type="button"
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => {
                          deleteAccount();
                        }}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                        onClick={() => setEditingDelete(false)}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    );
  };

  return (
    <AuthProvider>
      <Render />
    </AuthProvider>
  );
}
