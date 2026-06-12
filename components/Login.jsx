"use client";
import { useState } from "react";
import { useMountedFlag, enterStyle } from "@/components/charts";
import { Atmosphere } from "@/components/Atmosphere";

// Demo mode: role picker + simulated password (no Supabase env vars set).
// Live mode: Supabase email/password — role comes from the profiles table.
export function Login({ demo, error, onDemoEnter, onEmailEnter }) {
  const [role, setRole] = useState("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const m = useMountedFlag();

  const submit = () => (demo ? onDemoEnter(role) : onEmailEnter(email, password));

  return (
    <div className="app">
      <Atmosphere></Atmosphere>
      <div className="login-wrap">
        <div className="glass login-card" style={enterStyle(m, 60)}>
          <div className="brand-mark" aria-hidden="true">EB</div>
          <h1 className="serif-title">Europe's Bride <em>Growth Portal</em></h1>
          <div className="brand-sub">Rank Local Now · Secure Access</div>

          {demo ? (
            <div className="role-row">
              <button type="button" className={"role-btn" + (role === "admin" ? " sel" : "")} onClick={() => setRole("admin")}>Admin<small>Joshua Moon</small></button>
              <button type="button" className={"role-btn" + (role === "client" ? " sel" : "")} onClick={() => setRole("client")}>Client<small>Ivan Khalus</small></button>
            </div>
          ) : (
            <input type="email" placeholder="Email" value={email} aria-label="Email"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }}></input>
          )}

          <input type="password" placeholder="Password" aria-label="Password"
            defaultValue={demo ? "demo-preview" : undefined}
            value={demo ? undefined : password}
            onChange={demo ? undefined : (e) => setPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}></input>

          {error ? <p className="login-error">{error}</p> : null}
          <button type="button" className="enter-btn" onClick={submit}>Enter Portal</button>
          <p className="login-note">
            {demo
              ? "Demo mode — authentication is simulated. Connect Supabase (.env.local) for real accounts."
              : "Sign in with the account Rank Local Now set up for you."}
          </p>
        </div>
      </div>
    </div>
  );
}
