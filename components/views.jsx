"use client";
// Strategy tab, Notes & Feedback, Monthly Report tab — ported from the approved v2 design.
import { useState } from "react";
import { useMountedFlag, enterStyle, ProgressRing } from "@/components/charts";
import { Panel, EBIcons } from "@/components/panels";
import { useGeneralComments, useTaskComments } from "@/lib/hooks";

export function phaseProgress(tasks) {
  const score = tasks.reduce((s, t) => s + (t.status === "done" ? 1 : t.status === "progress" ? 0.5 : 0), 0);
  return Math.round((score / tasks.length) * 100);
}

export function overallProgress(strategy) {
  return phaseProgress(strategy.flatMap((p) => p.tasks));
}

const STATUS_META = {
  done: { label: "Done", cls: "st-done" },
  progress: { label: "In progress", cls: "st-progress" },
  upcoming: { label: "Upcoming", cls: "st-upcoming" }
};

const commentAuthor = (c) => c.author || (c.role === "admin" ? "Rank Local Now" : "Ivan");

function TaskRow({ task, list, onComment, delay }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const m = useMountedFlag();
  const meta = STATUS_META[task.status];
  const post = () => {
    if (!text.trim()) return;
    onComment(task.id, text.trim());
    setText("");
  };
  return (
    <li className="task-row" style={enterStyle(m, delay)}>
      <div className="task-line">
        <span className={"task-status " + meta.cls}>{task.status === "done" ? EBIcons.check : null}</span>
        <span className={"task-title" + (task.status === "done" ? " is-done" : "")}>{task.title}</span>
        <span className={"status-chip " + meta.cls}>{meta.label}</span>
        <button type="button" className={"task-comment-btn" + (open || list.length ? " active" : "")} onClick={() => setOpen(!open)} aria-label="Comments">
          {EBIcons.comment}{list.length ? <span className="tabular">{list.length}</span> : null}
        </button>
      </div>
      {open ? (
        <div className="task-comments">
          {list.map((c, i) => (
            <div key={c.id || i} className={"comment-bubble small" + (c.role === "admin" ? " agency" : "")}>
              <div className="comment-meta">{commentAuthor(c)} · {c.ts}</div>
              <div>{c.text}</div>
            </div>
          ))}
          <div className="comment-input-row">
            <input type="text" value={text} placeholder="Leave a note on this task…" onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") post(); }}></input>
            <button type="button" className="icon-btn" onClick={post} aria-label="Post comment">{EBIcons.send}</button>
          </div>
        </div>
      ) : null}
    </li>
  );
}

export function StrategyTab({ data, role }) {
  const { map, post } = useTaskComments(role);
  const m = useMountedFlag();
  const overall = overallProgress(data.strategy);
  return (
    <div className="tab-body">
      <Panel delay={0} className="strategy-hero">
        <div className="strategy-hero-inner">
          <ProgressRing percent={overall} label="Complete"></ProgressRing>
          <div>
            <h2 className="serif-title">Growth Strategy</h2>
            <p className="panel-sub" style={{ maxWidth: 520, marginTop: 8 }}>
              Three-phase plan to make Europe's Bride the most visible bridal boutique in Central Kentucky — in search engines, on the map, and inside AI assistants.
            </p>
            <div className="phase-pills">
              {data.strategy.map((p) => (
                <span key={p.id} className="phase-pill"><span className="tabular">{phaseProgress(p.tasks)}%</span> {p.title}</span>
              ))}
            </div>
          </div>
        </div>
      </Panel>
      <div className="phase-grid">
        {data.strategy.map((phase, pi) => {
          const pct = phaseProgress(phase.tasks);
          return (
            <Panel key={phase.id} title={phase.title} sub={phase.desc} delay={150 + pi * 130}
              right={<span className="tabular phase-pct">{pct}%</span>}>
              <div className="bar-track" style={{ marginBottom: 16 }}>
                <div className="bar-fill" style={{ width: m ? `${pct}%` : "0%" }}></div>
              </div>
              <ul className="task-list">
                {phase.tasks.map((t, i) => (
                  <TaskRow key={t.id} task={t} list={map[t.id] || []} onComment={post} delay={250 + pi * 130 + i * 60}></TaskRow>
                ))}
              </ul>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

export function CommentsPanel({ role, delay }) {
  const { items, post } = useGeneralComments(role);
  const [text, setText] = useState("");
  const send = () => { post(text); setText(""); };
  return (
    <Panel title="Notes & Feedback" sub="Leave a comment — your team sees it instantly" icon={EBIcons.comment} delay={delay} className="span-3 comments-panel">
      <div className="comment-thread">
        <div className="comment-bubble agency">
          <div className="comment-meta">Rank Local Now · Jun 2</div>
          <div>May report is live — AI referrals nearly doubled. Review the next-month focus and drop any questions here.</div>
        </div>
        {items.map((c, i) => (
          <div key={c.id || i} className={"comment-bubble" + (c.role === "admin" ? " agency" : "")}>
            <div className="comment-meta">{commentAuthor(c)} · {c.ts}</div>
            <div>{c.text}</div>
          </div>
        ))}
      </div>
      <div className="comment-input-row">
        <input type="text" value={text} placeholder="Write a comment…" onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }}></input>
        <button type="button" className="icon-btn" onClick={send} aria-label="Post comment">{EBIcons.send}</button>
      </div>
    </Panel>
  );
}

export function ReportTab({ data }) {
  const [idx, setIdx] = useState(0);
  const m = useMountedFlag();
  const r = data.reports[idx];
  return (
    <div className="tab-body">
      <div className="report-tabs" style={enterStyle(m, 0)}>
        {data.reports.map((rep, i) => (
          <button key={rep.month} type="button" className={"report-tab-btn" + (i === idx ? " active" : "")} onClick={() => setIdx(i)}>{rep.month}</button>
        ))}
      </div>
      <Panel delay={80} className="report-panel" key={r.month}>
        <div className="report-head">
          <div>
            <h2 className="serif-title">{r.month} Report</h2>
            <p className="panel-sub" style={{ marginTop: 6 }}>{r.updated}</p>
          </div>
          {idx === 0 ? <span className="live-pill"><span className="live-dot"></span>Latest</span> : null}
        </div>
        <p className="report-summary">{r.summary}</p>
        <div className="report-metrics">
          {r.metrics.map((mt) => (
            <div key={mt.label} className="report-metric">
              <div className="report-metric-val tabular">{mt.value}</div>
              <div className="kpi-label">{mt.label}</div>
              <div className="report-trend">{mt.trend}</div>
            </div>
          ))}
        </div>
        <div className="report-cols">
          <div>
            <div className="micro-label">Wins this month</div>
            <ul className="report-list">
              {r.wins.map((w) => <li key={w}><span className="win-dot">{EBIcons.check}</span>{w}</li>)}
            </ul>
          </div>
          <div>
            <div className="micro-label">Next month focus</div>
            <ul className="report-list">
              {r.next.map((n, i) => <li key={n}><span className="next-num tabular">{i + 1}</span>{n}</li>)}
            </ul>
          </div>
        </div>
      </Panel>
    </div>
  );
}
