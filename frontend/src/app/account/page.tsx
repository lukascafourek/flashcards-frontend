"use client";

import Header from "@/app/components/header";
import AuthProvider from "@/app/context/authContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "../hooks/useAuth";
import Footer from "../components/footer";
import { validateEmail, validateUsername, checkPasswords } from "../components/validationComponents";

export default function ShowAccountInfo() {
  const Render = () => {
    const { user, updateUsername, deleteAccount, checkPassword, /*updateUser*/ } = useAuth();
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

    useEffect(() => {
      setUsername(user?.username || "");
      setEmail(user?.email || "");
    } , [user]);

    const handleUpdateUsername = async () => {
      const error = await updateUsername(username);
      // const error = await updateUser(username, null, null);
      if (error) {
        setUsernameError(error);
      } else {
        setEditingUsername(false);
      }
    };

    const handleCheckPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      const error = await checkPassword(oldPassword, newEmail, newPassword);
      if (error) {
        setCheckError(error);
      } else {
        setCheckError("");
        setEditingOther(false);
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

    return (
      <div className="min-h-screen bg-gray-200">
        {/* Header */}
        <Header />

        {/* Account Info Section */}
        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
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
                      setUsernameError(validateUsername(e.target.value));
                    }}
                  />
                  <button
                    type="button"
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    disabled={usernameError !== ""}
                    onClick={() => handleUpdateUsername()}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 text-white px-2 py-1 rounded ml-2"
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
            {usernameError && <p className="text-red-500 mb-2 text-sm">{usernameError}</p>}
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
                    {checkError && <p className="text-red-500 mt-2 text-sm">{checkError}</p>}
                    <label className="block text-black mr-2 mt-2">Current password: </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your current password"
                        className="text-black border border-gray-300 rounded px-2 py-1 mr-2 w-full mt-2"
                        onChange={e => setOldPassword(e.target.value)}
                      />
                      <span className="absolute right-3 top-4 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                        <Image src="/eye.png" alt="Toggle Password Visibility" width={20} height={20}/>
                      </span>
                    </div>
                    <label className="block text-black mr-2 mt-2">New email: </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter your new email"
                        className="text-black border border-gray-300 rounded px-2 py-1 mr-2 w-full mt-2"
                        onChange={(e) => {
                          setNewEmail(e.target.value);
                          setEmailError(validateEmail(e.target.value));
                        }}
                      />
                    </div>
                    {emailError && <p className="text-red-500 mt-2 text-sm">{emailError}</p>}
                    <label className="block text-black mr-2 mt-2">New password: </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        className="text-black border border-gray-300 rounded px-2 py-1 mr-2 w-full mt-2"
                        onChange={e => {
                          setNewPassword(e.target.value);
                          setPasswordError(checkPasswords(e.target.value, confirmNewPassword));
                        }}
                      />
                      <span className="absolute right-3 top-4 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                        <Image src="/eye.png" alt="Toggle Password Visibility" width={20} height={20}/>
                      </span>
                    </div>
                    <label className="block text-black mr-2 mt-2">Confirm new password: </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password again"
                        className="text-black border border-gray-300 rounded px-2 py-1 mr-2 w-full mt-2"
                        onChange={e => {
                          setConfirmNewPassword(e.target.value);
                          setPasswordError(checkPasswords(newPassword, e.target.value));
                        }}
                      />
                      <span className="absolute right-3 top-4 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                        <Image src="/eye.png" alt="Toggle Password Visibility" width={20} height={20}/>
                      </span>
                    </div>
                    {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
                    <div className="flex mt-2">
                      <button
                        type = "button"
                        className="bg-green-500 text-white px-2 py-1 rounded"
                        onClick={handleCheckPassword}
                        disabled={emailError !== "" || passwordError !== "" || (!newEmail && !newPassword && !confirmNewPassword) || !oldPassword}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="bg-red-500 text-white px-2 py-1 rounded ml-2"
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
                        setPutEmail(e.target.value);
                        if (e.target.value === email) {
                          setDeleteEmailError("");
                        } else {
                          setDeleteEmailError("Email does not match ❌");
                        }
                      }}
                    />
                    {deleteEmailError && <p className="text-red-500 mt-2 text-sm">{deleteEmailError}</p>}
                    <div className="flex mt-2">
                      <button
                        type="button"
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        disabled={deleteEmailError !== "" || !putEmail}
                        onClick={() => handleDeleteAccount()}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className="bg-green-500 text-white px-2 py-1 rounded ml-2"
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
