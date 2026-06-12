"use client";
// SVG chart primitives — ported from the approved v2 design prototype.
import { useEffect, useState } from "react";

export function useMountedFlag() {
  const [m, setM] = useState(false);
  useEffect(() => {
    let r2;
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setM(true)); });
    return () => { cancelAnimationFrame(r1); if (r2) cancelAnimationFrame(r2); };
  }, []);
  return m;
}

export function enterStyle(m, delay = 0) {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return {};
  return {
    opacity: m ? 1 : 0,
    transform: m ? "translateY(0px)" : "translateY(18px)",
    transition: `opacity 0.7s cubic-bezier(0.2,0.7,0.2,1) ${delay}ms, transform 0.7s cubic-bezier(0.2,0.7,0.2,1) ${delay}ms`
  };
}

export function CountUp({ value, prefix = "", suffix = "", decimals = 0, duration = 1500 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(value); return; }
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      setN(value * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return (
    <span className="tabular">{prefix}{n.toLocaleString("en-US", { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}{suffix}</span>
  );
}

function smoothPath(pts) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

export function AreaChart({ data, labels, gradId = "eb-area" }) {
  const mounted = useMountedFlag();
  const W = 640, H = 210, padX = 8, padTop = 18, padBot = 26;
  const min = Math.min(...data) * 0.9, max = Math.max(...data) * 1.05;
  const span = (max - min) || 1;
  const pts = data.map((v, i) => [
    padX + (i / (data.length - 1)) * (W - padX * 2),
    padTop + (1 - (v - min) / span) * (H - padTop - padBot)
  ]);
  const line = smoothPath(pts);
  const area = `${line} L ${pts[pts.length - 1][0]},${H - padBot} L ${pts[0][0]},${H - padBot} Z`;
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }} aria-label="Sessions trend chart">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35"></stop>
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0"></stop>
        </linearGradient>
        <linearGradient id={gradId + "-line"} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent2)"></stop>
          <stop offset="55%" stopColor="var(--accent)"></stop>
          <stop offset="100%" stopColor="var(--accent3)"></stop>
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={padX} x2={W - padX} y1={padTop + f * (H - padTop - padBot)} y2={padTop + f * (H - padTop - padBot)} stroke="rgba(244,241,234,0.07)" strokeDasharray="2 6"></line>
      ))}
      <path d={area} fill={`url(#${gradId})`} style={{ opacity: mounted ? 1 : 0, transition: "opacity 1.4s ease 0.5s" }}></path>
      <path d={line} fill="none" stroke={`url(#${gradId + "-line"})`} strokeWidth="2.5" strokeLinecap="round" pathLength="1"
        style={{ strokeDasharray: 1, strokeDashoffset: mounted ? 0 : 1, transition: "stroke-dashoffset 1.8s cubic-bezier(.4,0,.2,1)" }}></path>
      <circle cx={last[0]} cy={last[1]} r="4" fill="var(--accent3)" style={{ opacity: mounted ? 1 : 0, transition: "opacity .4s ease 1.6s" }}></circle>
      <circle cx={last[0]} cy={last[1]} r="9" fill="none" stroke="var(--accent3)" strokeOpacity="0.4" className="pulse-ring" style={{ opacity: mounted ? 1 : 0 }}></circle>
      {labels.map((l, i) => (i % 2 === 1 ? null : (
        <text key={l} x={padX + (i / (labels.length - 1)) * (W - padX * 2)} y={H - 6} fill="rgba(244,241,234,0.4)" fontSize="11" textAnchor="middle" fontFamily="inherit">{l}</text>
      )))}
    </svg>
  );
}

export function Sparkline({ data, width = 120, height = 36, stroke = "var(--accent3)" }) {
  const mounted = useMountedFlag();
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => [
    2 + (i / (data.length - 1)) * (width - 4),
    4 + (1 - (v - min) / (max - min || 1)) * (height - 8)
  ]);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width, height, display: "block" }} aria-hidden="true">
      <path d={smoothPath(pts)} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" pathLength="1"
        style={{ strokeDasharray: 1, strokeDashoffset: mounted ? 0 : 1, transition: "stroke-dashoffset 1.6s cubic-bezier(.4,0,.2,1)" }}></path>
    </svg>
  );
}

export function DonutChart({ segments, size = 168, thickness = 16, centerLabel, centerValue }) {
  const mounted = useMountedFlag();
  const r = (size - thickness) / 2, c = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let offset = 0;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size, transform: "rotate(-90deg)" }} aria-label="Traffic sources">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(244,241,234,0.06)" strokeWidth={thickness}></circle>
        {segments.map((s, i) => {
          const frac = s.value / total;
          const dash = mounted ? Math.max(frac * c - 3, 0.5) : 0.5;
          const el = (
            <circle key={s.label} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.color}
              strokeWidth={thickness} strokeLinecap="round"
              strokeDasharray={`${dash} ${c}`} strokeDashoffset={-offset * c}
              style={{ transition: `stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1) ${0.15 + i * 0.1}s` }}></circle>
          );
          offset += frac;
          return el;
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeContent: "center", textAlign: "center" }}>
        <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em" }} className="tabular">{centerValue}</div>
        <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.12em" }}>{centerLabel}</div>
      </div>
    </div>
  );
}

export function HBar({ label, value, max, color = "var(--accent)", suffix = "", delay = 0 }) {
  const mounted = useMountedFlag();
  const pct = Math.round((value / (max || 1)) * 100);
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
        <span style={{ color: "var(--ink)" }}>{label}</span>
        <span className="tabular" style={{ color: "var(--muted)" }}>{value.toLocaleString()}{suffix}</span>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: mounted ? `${pct}%` : "0%", background: `linear-gradient(90deg, ${color}, var(--accent3))`, transitionDelay: `${delay}ms` }}></div>
      </div>
    </div>
  );
}

export function ProgressRing({ percent, size = 132, thickness = 10, label }) {
  const mounted = useMountedFlag();
  const r = (size - thickness) / 2, c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size, transform: "rotate(-90deg)" }} aria-label={`Progress ${percent}%`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(244,241,234,0.08)" strokeWidth={thickness}></circle>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#eb-ring-grad)" strokeWidth={thickness} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={mounted ? c * (1 - percent / 100) : c}
          style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(.4,0,.2,1) 0.2s" }}></circle>
        <defs>
          <linearGradient id="eb-ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--accent2)"></stop>
            <stop offset="50%" stopColor="var(--accent)"></stop>
            <stop offset="100%" stopColor="var(--accent3)"></stop>
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeContent: "center", textAlign: "center" }}>
        <div style={{ fontSize: 28, fontWeight: 600 }} className="tabular"><CountUp value={percent} suffix="%"></CountUp></div>
        {label ? <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.14em" }}>{label}</div> : null}
      </div>
    </div>
  );
}
