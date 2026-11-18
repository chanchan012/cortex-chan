import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { readConfig } from "@/server/config";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cortex — Infrastructure Lab",
  description: "Explore distributed architecture and follow traffic through a sample cloud topology.",
};
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = readConfig();
  return <html lang="en"><body>{settings.clerkPublicKey
    ? <ClerkProvider publishableKey={settings.clerkPublicKey} signInUrl="/sign-in" signUpUrl="/sign-up" signInFallbackRedirectUrl="/" signUpFallbackRedirectUrl="/">{children}</ClerkProvider>
    : children}</body></html>;
}
