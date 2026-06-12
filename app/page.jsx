"use client";
// Europe's Bride Growth Portal — app shell (tabs + auth gate), per the approved v2 design.
import { useEffect, useState } from "react";
import { useAuth, useDashboardData, ROLES } from "@/lib/hooks";
import { Atmosphere } from "@/components/Atmosphere";
import { Login } from "@/components/Login";
import { KpiCard, TrafficPanel, AIPanel, GBPPanel, BookingsPanel, Panel, EBIcons } from "@/components/panels";
import { StrategyTab, CommentsPanel, ReportTab, overallProgress } from "@/components/views";
import { useMountedFlag, enterStyle } from "@/components/charts";

const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "strategy", label: "Strategy" },
  { id: "report", label: "Monthly Report" }
];

function StrategySnapshot({ data, onOpen, delay }) {
  const overall = overallProgress(data.strategy);
  const m = useMountedFlag();
  return (
    <section className="glass strategy-snap" style={enterStyle(m, delay)}>
      <div className="snap-left">
        <span className="panel-icon">{EBIcons.check}</span>
        <div>
          <h2 className="panel-title">Strategy Progress</h2>
          <p className="panel-sub">SEO Foundation · CRM Setup · Google Business Profile</p>
        </div>
      </div>
      <div className="snap-bar">
        <div className="bar-track">
          <div className="bar-fill" style={{ width: m ? `${overall}%` : "0%" }}></div>
        </div>
      </div>
      <span className="tabular snap-pct">{overall}%</span>
      <button type="button" className="ghost-btn" onClick={onOpen}>View tasks →</button>
    </section>
  );
}

function DashboardTab({ data, role, goStrategy }) {
  const k = data.kpis;
  const revenue = k.bookings.value * data.meta.bookingValue;
  return (
    <div className="tab-body">
      <div className="kpi-grid">
        <KpiCard label="Website sessions" value={k.sessions.value} trend={k.sessions.trend} spark={data.sessionsTrend} delay={0} icon={EBIcons.traffic}></KpiCard>
        <KpiCard label="AI referrals" value={k.aiReferrals.value} trend={k.aiReferrals.trend} spark={data.ai.trend} delay={90} icon={EBIcons.ai}></KpiCard>
        <KpiCard label="GBP actions" value={k.gbpActions.value} trend={k.gbpActions.trend} delay={180} icon={EBIcons.pin} note="Calls · directions · clicks"></KpiCard>
        <KpiCard label="Revenue attributed" value={revenue} prefix="$" trend={k.bookings.trend} delay={270} icon={EBIcons.dollar} note={`${k.bookings.value} bookings × $${data.meta.bookingValue}`}></KpiCard>
      </div>
      <div className="main-grid">
        <TrafficPanel data={data} delay={250}></TrafficPanel>
        <AIPanel data={data} delay={350}></AIPanel>
      </div>
      <StrategySnapshot data={data} onOpen={goStrategy} delay={420}></StrategySnapshot>
      <div className="main-grid bottom">
        <GBPPanel data={data} delay={480}></GBPPanel>
        <BookingsPanel data={data} delay={560}></BookingsPanel>
        <CommentsPanel role={role} delay={640}></CommentsPanel>
      </div>
    </div>
  );
}

export default function Page() {
  const auth = useAuth();
  const data = useDashboardData();
  const [tab, setTab] = useState("dashboard");
  useEffect(() => {
    const saved = localStorage.getItem("eb_tab");
    if (saved) setTab(saved);
  }, []);
  useEffect(() => { localStorage.setItem("eb_tab", tab); }, [tab]);

  if (auth.loading) return null;
  if (!auth.role) {
    return <Login demo={auth.demo} error={auth.error} onDemoEnter={auth.signInDemo} onEmailEnter={auth.signInEmail}></Login>;
  }

  const roleMeta = ROLES[auth.role] || ROLES.client;

  return (
    <div className="app">
      <Atmosphere></Atmosphere>

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">EB</div>
          <div>
            <div className="brand-name">Europe's Bride</div>
            <div className="brand-sub">{data.meta.tagline}</div>
          </div>
        </div>
        <nav className="tabs" aria-label="Dashboard sections">
          {TABS.map((x) => (
            <button key={x.id} type="button" className={"tab-btn" + (tab === x.id ? " active" : "")} onClick={() => setTab(x.id)}>{x.label}</button>
          ))}
        </nav>
        <div className="sync">
          <span className="live-pill"><span className="live-dot"></span>Live</span>
          <span className="sync-text">{roleMeta.label}</span>
          <button type="button" className="signout-btn" onClick={auth.signOut}>Sign out</button>
        </div>
      </header>

      <main key={tab}>
        {tab === "dashboard" ? <DashboardTab data={data} role={auth.role} goStrategy={() => setTab("strategy")}></DashboardTab> : null}
        {tab === "strategy" ? <StrategyTab data={data} role={auth.role}></StrategyTab> : null}
        {tab === "report" ? <ReportTab data={data}></ReportTab> : null}
      </main>
    </div>
  );
}
