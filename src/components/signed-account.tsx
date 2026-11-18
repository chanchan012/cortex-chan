"use client";
import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";
export function SignedAccount() {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return <span aria-label="Loading session">…</span>;
  return isSignedIn ? <UserButton/> : <Link href="/sign-in">Sign in ↗</Link>;
}
