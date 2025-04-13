"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { LoadingSpinner } from "@/app/components/elements/loadingCircle";
import { useAuth } from "@/app/hooks/useAuth";

export default function OAuth2Redirect() {
  const { fetchUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const { token, isAdmin } = router.query;
    if (token && typeof token === "string" && typeof isAdmin === "string") {
      localStorage.setItem("jwt", token);
      localStorage.setItem("isAdmin", isAdmin);
      fetchUser().then(() => {
        router.replace("/collections");
      });
    } else {
      router.replace("/auth/login");
    }
  }, [router, fetchUser]);

  return <LoadingSpinner />;
}
