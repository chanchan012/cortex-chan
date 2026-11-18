import Link from "next/link";
import { Footer, Header } from "@/components/shell";
import { TrafficPreview } from "@/components/traffic-preview";

export default async function Landing({ searchParams }: { searchParams: Promise<{ demo?: string }> }) {
  const demo = (await searchParams).demo === "1";
  return <div className="screen"><Header/><main className={demo ? "landing demo" : "landing"}>
    <section className="intro"><p className="eyebrow"><span className="cross"/>Distributed systems sandbox</p>
      <h1>{demo ? <>Inside the<br/><em>topology.</em></> : <>Systems under<br/><em>pressure.</em></>}</h1>
      <p className="lede">{demo ? "Select a service to inspect its role, or switch the sample traffic profile to see how the readings change." : "Trace a request from gateway to database. Explore how cloud services connect and where traffic builds up."}</p>
      <div className="actions">{demo ? <Link className="primary" href="/">Back to overview <span>↗</span></Link> : <Link className="primary" href="/?demo=1">Explore guest demo <span>→</span></Link>}</div>
    </section>
    <TrafficPreview key={demo ? "demo" : "overview"} demo={demo}/>
  </main><Footer/></div>;
}
