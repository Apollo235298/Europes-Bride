"use client";
// Auth, dashboard data, and comments — each works in two modes:
// demo (no Supabase env vars: simulated login, mock data, localStorage comments)
// live (Supabase Auth with admin/client roles, dashboard_state jsonb doc, comments table).
import { useEffect, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { DEMO_DATA } from "@/lib/demo-data";

export const ROLES = {
  admin: { name: "Joshua Moon", short: "Rank Local Now", label: "Admin · Rank Local Now" },
  client: { name: "Ivan Khalus", short: "Ivan", label: "Client · Europe's Bride" }
};

const tsNow = (withTime) =>
  new Date().toLocaleDateString("en-US", withTime
    ? { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }
    : { month: "short", day: "numeric" });

/* ---------------- auth ---------------- */

export function useAuth() {
  const [auth, setAuth] = useState({ loading: true, role: null, name: null, error: null });

  useEffect(() => {
    if (!isSupabaseConfigured) {
      const role = sessionStorage.getItem("eb_role");
      setAuth({ loading: false, role, name: role ? ROLES[role].name : null, error: null });
      return;
    }
    let cancelled = false;
    const resolveProfile = async (session) => {
      if (!session) { if (!cancelled) setAuth({ loading: false, role: null, name: null, error: null }); return; }
      const { data } = await supabase.from("profiles").select("role, display_name").eq("id", session.user.id).single();
      if (!cancelled) setAuth({
        loading: false,
        role: data?.role || "client",
        name: data?.display_name || session.user.email,
        error: null
      });
    };
    supabase.auth.getSession().then(({ data }) => resolveProfile(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => resolveProfile(session));
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  const signInDemo = useCallback((role) => {
    sessionStorage.setItem("eb_role", role);
    setAuth({ loading: false, role, name: ROLES[role].name, error: null });
  }, []);

  const signInEmail = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuth((a) => ({ ...a, error: error.message }));
  }, []);

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    else sessionStorage.removeItem("eb_role");
    setAuth({ loading: false, role: null, name: null, error: null });
  }, []);

  return { ...auth, demo: !isSupabaseConfigured, signInDemo, signInEmail, signOut };
}

/* ---------------- dashboard data ---------------- */

export function useDashboardData() {
  const [data, setData] = useState(DEMO_DATA);
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.from("dashboard_state").select("data").eq("id", 1).single()
      .then(({ data: row }) => { if (row?.data) setData(row.data); });
  }, []);
  return data;
}

/* ---------------- comments ---------------- */

function loadLocal(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; } catch { return fallback; }
}

const normalizeRow = (r) => ({
  id: r.id,
  text: r.body,
  ts: new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
  role: r.profiles?.role || "client",
  author: r.profiles?.display_name || null
});

// General "Notes & Feedback" thread (task_id is null).
export function useGeneralComments(role) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!isSupabaseConfigured) { setItems(loadLocal("eb_comments_general", [])); return; }
    supabase.from("comments").select("id, body, created_at, profiles(display_name, role)")
      .is("task_id", null).order("created_at")
      .then(({ data }) => setItems((data || []).map(normalizeRow)));
  }, []);

  const post = useCallback(async (text) => {
    if (!text.trim()) return;
    if (!isSupabaseConfigured) {
      const next = [...loadLocal("eb_comments_general", []), { text: text.trim(), ts: tsNow(true), role }];
      localStorage.setItem("eb_comments_general", JSON.stringify(next));
      setItems(next);
      return;
    }
    const { data } = await supabase.from("comments").insert({ body: text.trim() })
      .select("id, body, created_at, profiles(display_name, role)").single();
    if (data) setItems((xs) => [...xs, normalizeRow(data)]);
  }, [role]);

  return { items, post };
}

// Per-task comments across the whole strategy board, as a map keyed by task id.
export function useTaskComments(role) {
  const [map, setMap] = useState({});

  useEffect(() => {
    if (!isSupabaseConfigured) { setMap(loadLocal("eb_task_comments", {})); return; }
    supabase.from("comments").select("id, body, created_at, task_id, profiles(display_name, role)")
      .not("task_id", "is", null).order("created_at")
      .then(({ data }) => {
        const m = {};
        (data || []).forEach((r) => { (m[r.task_id] = m[r.task_id] || []).push(normalizeRow(r)); });
        setMap(m);
      });
  }, []);

  const post = useCallback(async (taskId, text) => {
    if (!text.trim()) return;
    if (!isSupabaseConfigured) {
      const m = loadLocal("eb_task_comments", {});
      const next = { ...m, [taskId]: [...(m[taskId] || []), { text: text.trim(), ts: tsNow(false), role }] };
      localStorage.setItem("eb_task_comments", JSON.stringify(next));
      setMap(next);
      return;
    }
    const { data } = await supabase.from("comments").insert({ body: text.trim(), task_id: taskId })
      .select("id, body, created_at, task_id, profiles(display_name, role)").single();
    if (data) setMap((m) => ({ ...m, [taskId]: [...(m[taskId] || []), normalizeRow(data)] }));
  }, [role]);

  return { map, post };
}
