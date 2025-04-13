"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { LoadingSpinner } from "@/app/components/elements/loadingCircle";

export default function OAuth2Redirect() {
  const router = useRouter();

  useEffect(() => {
    const { token, isAdmin } = router.query;
    if (token && typeof token === "string" && typeof isAdmin === "string") {
      localStorage.setItem("jwt", token);
      localStorage.setItem("isAdmin", isAdmin);
      router.replace("/collections");
    } else {
      router.replace("/auth/login");
    }
  }, [router]);

  return <LoadingSpinner />;
};
