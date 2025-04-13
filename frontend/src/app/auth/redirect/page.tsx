"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/app/components/elements/loadingCircle";
import { useAuth } from "@/app/hooks/useAuth";
import { useSearchParams } from "next/navigation";

export default function OAuth2Redirect() {
  const { fetchUser } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const isAdmin = params.get("isAdmin");

  useEffect(() => {
    if (sessionStorage.getItem("user") !== null) {
      router.push("/collections");
    }
    if (token && typeof token === "string" && typeof isAdmin === "string") {
      localStorage.setItem("jwt", token);
      localStorage.setItem("isAdmin", isAdmin);
      fetchUser().then(() => {
        router.push("/collections");
      });
    } else {
      router.push("/auth/login");
    }
  }, [router, fetchUser, token, isAdmin]);

  return <LoadingSpinner />;
}
