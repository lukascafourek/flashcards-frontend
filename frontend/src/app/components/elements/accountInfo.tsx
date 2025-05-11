"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "../../hooks/useAuth";
import { handleChange } from "../../components/functions/inputValidation";
import {
  validateEmail,
  validateUsername,
  checkPasswords,
} from "../../components/functions/credentialValidations";

// This file contains the AccountInfo component, which allows users to view and edit their account information, including username, email, and password.
// It also provides functionality for deleting the account.

const MAX_CHAR_LIMIT = 255;

const AccountInfo = () => {
  const { user, login, deleteAccount, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [editingOther, setEditingOther] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [checkError, setCheckError] = useState("");
  const [editingDelete, setEditingDelete] = useState(false);
  const [deleteEmailError, setDeleteEmailError] = useState("");
  const [putEmail, setPutEmail] = useState("");

  const handleUpdateUsername = async () => {
    const error = await updateUser(username, null, null, null);
    if (error) {
      setUsernameError(error);
    } else {
      setEditingUsername(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = await updateUser(null, newEmail, newPassword, oldPassword);
    if (error) {
      setCheckError(error);
    } else {
      setCheckError("");
      setEditingOther(false);
      login(newEmail, newPassword !== "" ? newPassword : oldPassword);
    }
  };

  const handleDeleteAccount = async () => {
    const error = await deleteAccount();
    if (error) {
      setDeleteEmailError(error);
    } else {
      setEditingDelete(false);
    }
  };

  useEffect(() => {
    setUsername(user?.username || "");
    setEmail(user?.email || "");
  }, [user]);

  return (
    <div className="w-full max-w-xl p-6 bg-white rounded-lg shadow-md my-8 md:min-h-[450px] min-h-[400px]">
      <h2 className="text-center text-black text-xl font-semibold mb-8">
        Your account
      </h2>

      {/* Username Section */}
      <div className="flex items-center mb-2">
        {!editingUsername ? (
          <>
            <label className="block text-black mr-2 w-full">
              Username: {username}
            </label>
            <button
              type="button"
              title="Edit Username"
              className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center justify-center hover:bg-blue-600"
              onClick={() => setEditingUsername(true)}
            >
              <Image src="/edit.png" alt="Edit" width={20} height={20} />
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
                handleChange(e.target.value, setUsername, MAX_CHAR_LIMIT);
                setUsernameError(validateUsername(e.target.value));
              }}
            />
            <button
              type="button"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              disabled={usernameError !== ""}
              onClick={() => handleUpdateUsername()}
            >
              Save
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-gray-600"
              onClick={() => {
                setUsername(user?.username || "");
                setUsernameError("");
                setEditingUsername(false);
              }}
            >
              Cancel
            </button>
          </>
        )}
      </div>
      {usernameError && (
        <p className="text-red-500 mb-2 text-sm">{usernameError}</p>
      )}

      {/* Email and Password Section */}
      <label className="block text-black mr-2 mb-2">Email: {email}</label>
      {user?.provider === "LOCAL" && (
        <div className="flex items-center mt-8">
          {!editingOther ? (
            <>
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={() => setEditingOther(true)}
              >
                Edit Email or Password
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="block text-black mr-2 font-semibold">
                  Editing both email and password is not necessary.
                </label>
                {checkError && (
                  <p className="text-red-500 mt-2 text-sm">{checkError}</p>
                )}
                <label className="block text-black mr-2 mt-2">
                  Current password:{" "}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your current password"
                    className="text-black border border-gray-300 rounded px-2 py-1 mr-2 w-full mt-2"
                    onChange={(e) =>
                      handleChange(
                        e.target.value,
                        setOldPassword,
                        MAX_CHAR_LIMIT
                      )
                    }
                  />
                  <span
                    className="absolute right-3 top-4 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Image
                      src="/eye.png"
                      alt="Toggle Password Visibility"
                      width={20}
                      height={20}
                    />
                  </span>
                </div>
                <label className="block text-black mr-2 mt-2">
                  New email:{" "}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your new email"
                    className="text-black border border-gray-300 rounded px-2 py-1 mr-2 w-full mt-2"
                    onChange={(e) => {
                      handleChange(e.target.value, setNewEmail, MAX_CHAR_LIMIT);
                      setEmailError(validateEmail(e.target.value));
                    }}
                  />
                </div>
                {emailError && (
                  <p className="text-red-500 mt-2 text-sm">{emailError}</p>
                )}
                <label className="block text-black mr-2 mt-2">
                  New password:{" "}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    className="text-black border border-gray-300 rounded px-2 py-1 mr-2 w-full mt-2"
                    onChange={(e) => {
                      handleChange(
                        e.target.value,
                        setNewPassword,
                        MAX_CHAR_LIMIT
                      );
                      setPasswordError(
                        checkPasswords(e.target.value, confirmNewPassword)
                      );
                    }}
                  />
                  <span
                    className="absolute right-3 top-4 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Image
                      src="/eye.png"
                      alt="Toggle Password Visibility"
                      width={20}
                      height={20}
                    />
                  </span>
                </div>
                <label className="block text-black mr-2 mt-2">
                  Confirm new password:{" "}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password again"
                    className="text-black border border-gray-300 rounded px-2 py-1 mr-2 w-full mt-2"
                    onChange={(e) => {
                      handleChange(
                        e.target.value,
                        setConfirmNewPassword,
                        MAX_CHAR_LIMIT
                      );
                      setPasswordError(
                        checkPasswords(newPassword, e.target.value)
                      );
                    }}
                  />
                  <span
                    className="absolute right-3 top-4 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Image
                      src="/eye.png"
                      alt="Toggle Password Visibility"
                      width={20}
                      height={20}
                    />
                  </span>
                </div>
                {passwordError && (
                  <p className="text-red-500 text-sm mt-2">{passwordError}</p>
                )}
                <div className="flex mt-2">
                  <button
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 rounded-md enabled:hover:bg-green-600"
                    onClick={handleUpdateUser}
                    disabled={
                      emailError !== "" ||
                      passwordError !== "" ||
                      (!newEmail.trim() &&
                        !newPassword.trim() &&
                        !confirmNewPassword.trim()) ||
                      !oldPassword.trim()
                    }
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-gray-600"
                    onClick={() => {
                      setEmailError("");
                      setPasswordError("");
                      setCheckError("");
                      setEditingOther(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Delete Account Section */}
      <div
        className={`flex items-center ${
          user?.provider === "LOCAL" ? "mt-2" : "mt-8"
        }`}
      >
        {!editingDelete ? (
          <>
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={() => setEditingDelete(true)}
            >
              Delete Account
            </button>
          </>
        ) : (
          <>
            <div>
              <label className="block text-black mr-2 font-semibold">
                Are you sure you want to delete your account?
              </label>
              <label className="block text-black mr-2">
                To delete your account, type your email below.
              </label>
              <input
                type="text"
                placeholder="Enter your email"
                className="text-black border border-gray-300 rounded px-2 py-1 mr-2 w-full"
                onChange={(e) => {
                  handleChange(e.target.value, setPutEmail, MAX_CHAR_LIMIT);
                  if (e.target.value === email) {
                    setDeleteEmailError("");
                  } else {
                    setDeleteEmailError("Email does not match ❌");
                  }
                }}
              />
              {deleteEmailError && (
                <p className="text-red-500 mt-2 text-sm">{deleteEmailError}</p>
              )}
              <div className="flex mt-2">
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded-md enabled:hover:bg-red-600"
                  disabled={deleteEmailError !== "" || !putEmail.trim()}
                  onClick={() => handleDeleteAccount()}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="bg-green-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-green-600"
                  onClick={() => {
                    setDeleteEmailError("");
                    setEditingDelete(false);
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountInfo;
