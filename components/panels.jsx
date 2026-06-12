"use client";
// Dashboard panels & UI primitives — ported from the approved v2 design prototype.
// Data flows in via props (EB_DATA shape from lib/demo-data.js / Supabase dashboard_state).
import { useMountedFlag, enterStyle, CountUp, AreaChart, Sparkline, DonutChart, HBar } from "@/components/charts";

export const EBIcons = {
  traffic: <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 16l4-6 3.5 4L17 5"></path><path d="M13 5h4v4"></path></svg>,
  ai: <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2.5l1.8 4.6 4.7 1.9-4.7 1.9L10 15.5l-1.8-4.6-4.7-1.9 4.7-1.9z"></path><path d="M16.5 14.5l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z"></path></svg>,
  pin: <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 18s6-5.1 6-9.5A6 6 0 004 8.5C4 12.9 10 18 10 18z"></path><circle cx="10" cy="8.5" r="2.2"></circle></svg>,
  dollar: <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2.5v15"></path><path d="M14 5.5H8.2a2.4 2.4 0 000 4.8h3.6a2.4 2.4 0 010 4.8H6"></path></svg>,
  calendar: <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4.5" width="14" height="13" rx="2"></rect><path d="M3 8.5h14M7 2.5v4M13 2.5v4"></path></svg>,
  comment: <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 9.5a6.5 6.5 0 01-9.6 5.7L3 16.5l1.4-4A6.5 6.5 0 1117 9.5z"></path></svg>,
  check: <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10.5l4 4 8-9"></path></svg>,
  star: <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor"><path d="M10 1.8l2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7.9-5.6-4-4 5.6-.8z"></path></svg>,
  send: <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 2.5L9 11M17.5 2.5l-5.5 15-3-6.5-6.5-3z"></path></svg>
};

export function TrendChip({ value }) {
  const up = value >= 0;
  return (
    <span className={"trend-chip " + (up ? "up" : "down")}>
      <svg viewBox="0 0 10 10" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ transform: up ? "none" : "scaleY(-1)" }}><path d="M1.5 7.5l3-3 1.8 1.8L8.5 2.5"></path><path d="M5.5 2.5h3v3"></path></svg>
      {`${up ? "+" : ""}${value}%`}
    </span>
  );
}

export function Panel({ title, sub, icon, right, children, className = "", delay = 0, style = {} }) {
  const m = useMountedFlag();
  return (
    <section className={"glass " + className} style={{ ...enterStyle(m, delay), ...style }}>
      {title ? (
        <header className="panel-head">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {icon ? <span className="panel-icon">{icon}</span> : null}
            <div>
              <h2 className="panel-title">{title}</h2>
              {sub ? <p className="panel-sub">{sub}</p> : null}
            </div>
          </div>
          {right ? <div>{right}</div> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}

export function KpiCard({ label, value, prefix = "", trend, spark, delay = 0, icon, note }) {
  const m = useMountedFlag();
  return (
    <section className="glass kpi" style={enterStyle(m, delay)}>
      <div className="kpi-top">
        <span className="panel-icon">{icon}</span>
        <TrendChip value={trend}></TrendChip>
      </div>
      <div className="kpi-value"><CountUp value={value} prefix={prefix}></CountUp></div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-foot">
        {spark ? <Sparkline data={spark}></Sparkline> : <span className="kpi-note">{note}</span>}
      </div>
    </section>
  );
}

export function TrafficPanel({ data, delay }) {
  const total = data.sources.reduce((s, x) => s + x.value, 0);
  return (
    <Panel title="Website Traffic" sub="Google Analytics · last 30 days" icon={EBIcons.traffic} delay={delay}
      right={<span className="live-pill"><span className="live-dot"></span>Synced</span>} className="span-7">
      <AreaChart data={data.sessionsTrend} labels={data.weekLabels}></AreaChart>
      <div className="src-row">
        <DonutChart segments={data.sources} size={150} thickness={14} centerValue={total.toLocaleString()} centerLabel="Sessions"></DonutChart>
        <ul className="legend">
          {data.sources.map((s) => (
            <li key={s.label}>
              <span className="legend-dot" style={{ background: s.color }}></span>
              <span className="legend-label">{s.label}</span>
              <span className="legend-val tabular">{Math.round((s.value / total) * 100)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}

export function AIPanel({ data, delay }) {
  const ai = data.ai;
  const max = Math.max(...ai.engines.map((e) => e.value));
  return (
    <Panel title="AI Visibility" sub="Referrals & citations from AI assistants" icon={EBIcons.ai} delay={delay} className="span-5 ai-panel">
      <div className="ai-hero">
        <div>
          <div className="ai-big"><CountUp value={ai.total}></CountUp></div>
          <div className="kpi-label">AI referral sessions</div>
        </div>
        <div className="ai-side">
          <div><span className="tabular ai-stat">{ai.citations}</span><span className="ai-stat-label">citations tracked</span></div>
          <div><span className="tabular ai-stat">{ai.share}%</span><span className="ai-stat-label">of all traffic</span></div>
        </div>
      </div>
      <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
        {ai.engines.map((e, i) => (
          <HBar key={e.label} label={e.label} value={e.value} max={max} color="var(--accent2)" delay={i * 120}></HBar>
        ))}
      </div>
      <div className="ai-queries">
        <div className="micro-label">Cited for</div>
        <div className="query-chips">
          {ai.topQueries.map((q) => <span key={q} className="query-chip">"{q}"</span>)}
        </div>
      </div>
    </Panel>
  );
}

export function GBPPanel({ data, delay }) {
  const gbp = data.gbp;
  return (
    <Panel title="Google Business Profile" sub="Profile performance · last 30 days" icon={EBIcons.pin} delay={delay} className="span-4">
      <div className="gbp-stats">
        <div>
          <div className="gbp-num"><CountUp value={gbp.views}></CountUp></div>
          <div className="kpi-label">Profile views</div>
        </div>
        <div className="gbp-rating">
          <span className="rating-star">{EBIcons.star}</span>
          <span className="tabular" style={{ fontSize: 22, fontWeight: 600 }}>{gbp.rating.toFixed(1)}</span>
          <span className="ai-stat-label">{gbp.reviews} reviews · {gbp.newReviews} new</span>
        </div>
      </div>
      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        {gbp.actions.map((a, i) => (
          <HBar key={a.label} label={a.label} value={a.value} max={a.max} delay={i * 120}></HBar>
        ))}
      </div>
    </Panel>
  );
}

export function BookingsPanel({ data, delay }) {
  const m = useMountedFlag();
  const count = data.kpis.bookings.value;
  const revenue = count * data.meta.bookingValue;
  return (
    <Panel title="CRM Bookings" sub={`${count} bookings × $${data.meta.bookingValue} attributed value`} icon={EBIcons.calendar} delay={delay} className="span-5"
      right={<div className="revenue-tag"><span className="tabular"><CountUp value={revenue} prefix="$"></CountUp></span><span>attributed</span></div>}>
      <ul className="booking-list">
        {data.bookings.map((b, i) => (
          <li key={b.name + b.date} className="booking-row" style={enterStyle(m, 300 + i * 70)}>
            <span className="avatar">{b.name.charAt(0)}</span>
            <span className="booking-main">
              <span className="booking-name">{b.name}</span>
              <span className="booking-service">{b.service}</span>
            </span>
            <span className={"source-chip" + (b.source === "ChatGPT" || b.source === "Perplexity" ? " ai-src" : "")}>{b.source}</span>
            <span className="booking-date">{b.date}</span>
            <span className="booking-val tabular">${data.meta.bookingValue}</span>
          </li>
        ))}
      </ul>
      <p className="panel-foot">Showing {data.bookings.length} of {count} bookings this period</p>
    </Panel>
  );
}
