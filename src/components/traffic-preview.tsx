"use client";
import { useState } from "react";

const nodes = [
  { id: "gateway", label: "Gateway", x: 94, y: 165, layers: 2, role: "Routes incoming requests to the API service." },
  { id: "api", label: "API service", x: 234, y: 128, layers: 3, role: "Serves requests using the cache and database." },
  { id: "cache", label: "Redis cache", x: 389, y: 77, layers: 2, role: "Returns frequently requested data from memory." },
  { id: "db", label: "Postgres", x: 389, y: 206, layers: 3, role: "Stores persistent records for the API service." },
];
const paths = ["M94 165l50 25 90-45v-17", "M234 128l60 30 95-48V77", "M234 128l155 78"];
const initials = ["⇄", "{ }", "ϟ", "≡"];
export function TrafficPreview({ demo }: { demo: boolean }) {
  const [paused, setPaused] = useState(false);
  const [spike, setSpike] = useState(false);
  const [selected, select] = useState<number | null>(null);
  const current = selected === null ? null : nodes[selected];
  return <section className="console" aria-label="Sample topology preview">
    <div className="console-head"><span><span className="signal">▥</span> Traffic console</span><button className="play" onClick={() => setPaused(!paused)} aria-label={paused ? "Play packets" : "Pause packets"}>{paused ? "▷" : "Ⅱ"}</button></div>
    <div className="canvas">
      <div className="canvas-top"><span><i/> {paused ? "Paused" : "Sample flow"}</span><span>FIG. 01</span></div>
      <svg className={paused ? "network paused" : "network"} viewBox="0 0 490 275" role="group" aria-label="Gateway to API, cache and Postgres">
        <defs><pattern id="grid" width="42" height="21" patternUnits="userSpaceOnUse"><path d="M0 0L42 21M0 21L42 0" fill="none" stroke="#304039" strokeWidth=".6"/></pattern></defs>
        <rect width="490" height="275" fill="url(#grid)"/>
        {paths.map((d,i) => <g key={d}><path d={d} className="wire-shadow"/><path d={d} className="wire"/><path d={d} className="packet" style={{animationDelay: i * -1.3 + "s", animationDuration: spike ? "2s" : "4s"}}/></g>)}
        {nodes.map((n,i) => <g className="device" key={n.id} role="button" tabIndex={0} aria-label={`Inspect ${n.label}`} aria-pressed={selected === i}
          onClick={() => select(i)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(i); } }} transform={`translate(${n.x} ${n.y})`}>
          <ellipse cx="0" cy="5" rx="46" ry="14" fill="#0a1512" opacity=".65"/>
          {Array.from({ length: n.layers }, (_,k) => <g key={k} transform={`translate(0 ${-k*9})`} stroke={i === 1 || selected === i ? "#b9ed85" : "#7f9e94"} strokeWidth="1.1" strokeLinejoin="round">
            <path d="m-35 -18 35 17 35-17v7L0 7l-35-18Z" fill={i===1 ? "#516e43" : "#35463f"}/>
            <path d="M0-1v8M-29-14l5 2.5" fill="none"/><path d="m0-35 35 17L0-1l-35-17Z" fill={i===1 ? "#a5ce78" : "#425950"}/>
          </g>)}
          <text y={-16-(n.layers-1)*9} textAnchor="middle" transform="rotate(-8)" fontSize="16" fontWeight="bold" fill={i===1 ? "#273b20" : "#d9ebe0"}>{initials[i]}</text>
          <rect x="-42" y="16" width="84" height="21" rx="3" fill="#16231e" stroke={selected===i ? "#c2f56c" : "#486154"}/><text y="30" textAnchor="middle" fontSize="11" fill="#ebf4e9">{n.label}</text>
        </g>)}
      </svg>
      <div className="canvas-note" aria-live="polite">{current ? current.role : "Select a service to inspect"}</div>
    </div>
    <div className="readouts"><Metric name="Throughput" value={spike ? "3,600" : "1,200"} unit="rps"/><Metric name="P95 latency" value={spike ? "106" : "42"} unit="ms"/><Metric name="Error rate" value={spike ? "0.8" : "0.0"} unit="%"/></div>
    <div className="console-foot"><span>Illustrative readings</span>{demo ? <button onClick={() => setSpike(!spike)} aria-pressed={spike}>{spike ? "Spike ×3" : "Steady ×1"} ⇄</button> : <span>Steady profile</span>}</div>
  </section>;
}
function Metric({ name, value, unit }: {name:string;value:string;unit:string}) {
  return <div><span>{name}</span><strong>{value}<small>{unit}</small></strong></div>;
}
