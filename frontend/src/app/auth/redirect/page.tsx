"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/app/components/elements/loadingCircle";
import { useAuth } from "@/app/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

// This page handles the OAuth2 redirect from the authentication provider.
export default function OAuth2Redirect() {
  const { fetchUser } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  useEffect(() => {
    if (token && typeof token === "string") {
      Cookies.set('jwt', token, { expires: 7, path: '/' });
      fetchUser().then(() => {
        router.push("/collections");
      });
    } else {
      router.push("/auth/login");
    }
  }, [router, fetchUser, token]);

  return <LoadingSpinner />;
}
