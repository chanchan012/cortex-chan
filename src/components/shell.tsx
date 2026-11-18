import Link from "next/link";
import { SignedAccount } from "./signed-account";
import { readConfig } from "@/server/config";

export function Mark() {
  return <svg aria-hidden="true" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round"><path d="m16 2 13 7-13 7L3 9Z M3 15l13 7 13-7 M3 21l13 7 13-7"/></svg>;
}
export function Header() {
  return <header className="header"><Link href="/" aria-label="Cortex home" className="brand"><Mark/>Cortex</Link><span className="lab-name">Infrastructure lab</span><div className="header-end">{readConfig().clerkPublicKey ? <SignedAccount/> : <Link href="/sign-in">Sign in <span aria-hidden="true">↗</span></Link>}</div></header>;
}
export function Footer() {
  return <footer><span><i/> Cortex infrastructure lab</span><span className="footer-right">Foundation build <b>/</b> v0.1</span></footer>;
}
