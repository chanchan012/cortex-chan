import { SignIn, SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { readConfig } from "@/server/config";
import { Header, Footer, Mark } from "./shell";

export function AuthPage({ signup = false }: { signup?: boolean }) {
  const configured = Boolean(readConfig().clerkPublicKey);
  return <div className="screen"><Header/><main className="auth-main">
    {configured ? (signup ? <SignUp path="/sign-up" routing="path"/> : <SignIn path="/sign-in" routing="path"/>) :
    <section className="auth-card"><div className="auth-mark"><Mark/></div><p className="eyebrow">Guest access</p><h1>Enter the lab.</h1>
      <p>This deployment is in guest mode. Explore the sample architecture without an account.</p>
      <Link className="primary" href="/?demo=1">Continue as guest <span>→</span></Link></section>}
  </main><Footer/></div>;
}
