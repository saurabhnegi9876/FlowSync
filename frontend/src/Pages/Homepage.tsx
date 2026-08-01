import React, { useState } from "react";
import { Link } from "react-router-dom";
/**
 * FlowSync — marketing homepage
 * Single-file, responsive (mobile + laptop) React/TypeScript component.
 * No external CSS files: all styling lives in the <style> block below,
 * scoped under the .fs-root class to avoid leaking into the host page.
 */

type SubmitState = "idle" | "success" | "error";

const REASONS: { title: string; body: string; tone: "todo" | "progress" | "done" }[] = [
  {
    title: "One board everyone actually trusts",
    body:
      "Backlog, sprint, and roadmap stay in sync automatically, so status meetings stop being where the real update happens.",
    tone: "todo",
  },
  {
    title: "Built for how work really moves",
    body:
      "Issues, subtasks, and dependencies follow the shape of your team's process instead of forcing your process into rigid templates.",
    tone: "progress",
  },
  {
    title: "Context stays with the work",
    body:
      "Comments, decisions, and file links live on the card itself, so nobody has to go digging through chat history to understand why something changed.",
    tone: "done",
  },
  {
    title: "Visibility without extra reporting",
    body:
      "Leads get a clear read on progress straight from the board data, cutting out the status-update busywork for everyone else.",
    tone: "progress",
  },
];

export default function FlowSyncLanding(): React.JSX.Element {
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [navOpen, setNavOpen] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    setSubmitState(isValid ? "success" : "error");
  }

  return (
    <div className="fs-root">
      <style>{`
        .fs-root {
          --canvas: #F1F3F7;
          --surface: #FFFFFF;
          --ink: #12151C;
          --ink-muted: #565D6D;
          --border: #E1E4EA;
          --accent: #4B3DF2;
          --accent-hover: #3C2FE0;
          --accent-soft: #E9E6FD;
          --lane-todo: #9AA1B1;
          --lane-progress: #4B3DF2;
          --lane-done: #17A673;

          --font-display: "Space Grotesk", "Segoe UI", system-ui, sans-serif;
          --font-body: "Inter", "Segoe UI", system-ui, sans-serif;

          font-family: var(--font-body);
          background: var(--canvas);
          color: var(--ink);
          -webkit-font-smoothing: antialiased;
          line-height: 1.5;
        }

        .fs-root * { box-sizing: border-box; }

        .fs-root a { color: inherit; text-decoration: none; }

        .fs-root button {
          font-family: inherit;
          cursor: pointer;
        }

        .fs-root :focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }

        /* ---------- layout shells ---------- */
        .fs-container {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ---------- nav ---------- */
        .fs-nav {
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(241, 243, 247, 0.85);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--border);
        }

        .fs-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
        }

        .fs-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 20px;
          letter-spacing: -0.01em;
        }

        .fs-logo-mark {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          background: linear-gradient(135deg, var(--lane-todo) 0%, var(--accent) 55%, var(--lane-done) 100%);
          flex-shrink: 0;
        }

        .fs-nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .fs-btn {
          font-size: 14px;
          font-weight: 600;
          padding: 10px 18px;
          border-radius: 8px;
          border: 1px solid transparent;
          transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
          white-space: nowrap;
        }

        .fs-btn-ghost {
          background: transparent;
          color: var(--ink);
          border-color: var(--border);
        }
        .fs-btn-ghost:hover { background: var(--surface); border-color: var(--ink-muted); }

        .fs-btn-primary {
          background: var(--accent);
          color: #fff;
        }
        .fs-btn-primary:hover { background: var(--accent-hover); }

        .fs-nav-toggle {
          display: none;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 8px;
          width: 40px;
          height: 40px;
          align-items: center;
          justify-content: center;
        }

        /* ---------- hero ---------- */
        .fs-hero {
          padding: 72px 0 64px;
        }

        .fs-hero-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 56px;
          align-items: center;
        }

        .fs-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: var(--accent);
          background: var(--accent-soft);
          padding: 6px 12px;
          border-radius: 999px;
          margin-bottom: 20px;
        }

        .fs-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
        }

        .fs-h1 {
          font-family: var(--font-display);
          font-size: clamp(34px, 4.4vw, 54px);
          line-height: 1.06;
          letter-spacing: -0.02em;
          font-weight: 600;
          margin: 0 0 20px;
        }

        .fs-h1 em {
          font-style: normal;
          color: var(--accent);
        }

        .fs-sub {
          font-size: 17px;
          color: var(--ink-muted);
          max-width: 480px;
          margin: 0 0 32px;
        }

        .fs-form {
          display: flex;
          gap: 10px;
          max-width: 460px;
        }

        .fs-input {
          flex: 1;
          min-width: 0;
          padding: 13px 16px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--surface);
          font-size: 15px;
          color: var(--ink);
        }
        .fs-input::placeholder { color: #9099AC; }
        .fs-input:focus { border-color: var(--accent); }

        .fs-form-note {
          font-size: 13px;
          color: var(--ink-muted);
          margin-top: 10px;
        }

        .fs-form-msg {
          font-size: 13px;
          margin-top: 10px;
          font-weight: 500;
        }
        .fs-form-msg.success { color: var(--lane-done); }
        .fs-form-msg.error { color: #C4432B; }

        /* ---------- signature: mock board ---------- */
        .fs-board {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 18px;
          box-shadow: 0 24px 48px -24px rgba(18, 21, 28, 0.18);
        }

        .fs-board-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
          padding: 0 4px;
        }

        .fs-board-title {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 600;
          color: var(--ink-muted);
        }

        .fs-board-cols {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .fs-col {
          background: var(--canvas);
          border-radius: 10px;
          padding: 10px;
          min-height: 220px;
          position: relative;
          overflow: hidden;
        }

        .fs-col-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--ink-muted);
          margin-bottom: 10px;
          padding: 0 2px;
        }

        .fs-col-dot { width: 7px; height: 7px; border-radius: 50%; }
        .fs-col-dot.todo { background: var(--lane-todo); }
        .fs-col-dot.progress { background: var(--lane-progress); }
        .fs-col-dot.done { background: var(--lane-done); }

        .fs-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--ink);
          margin-bottom: 8px;
          box-shadow: 0 1px 2px rgba(18, 21, 28, 0.04);
        }

        .fs-card-tag {
          display: block;
          font-size: 10.5px;
          font-weight: 600;
          color: var(--ink-muted);
          margin-top: 5px;
        }

        .fs-card-moving {
          position: relative;
          animation: fs-glide 9s ease-in-out infinite;
        }

        @keyframes fs-glide {
          0%, 8%   { transform: translateX(0) scale(1);      opacity: 1; }
          30%, 38% { transform: translateX(148%) scale(1.02); opacity: 1; }
          60%, 68% { transform: translateX(296%) scale(1);    opacity: 1; }
          92%,100% { transform: translateX(296%) scale(1);    opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .fs-card-moving { animation: none; }
        }

        /* ---------- why join ---------- */
        .fs-why {
          padding: 64px 0 80px;
          border-top: 1px solid var(--border);
        }

        .fs-why-head {
          max-width: 560px;
          margin-bottom: 40px;
        }

        .fs-h2 {
          font-family: var(--font-display);
          font-size: clamp(26px, 3vw, 34px);
          letter-spacing: -0.01em;
          margin: 0 0 12px;
        }

        .fs-why-sub {
          color: var(--ink-muted);
          font-size: 16px;
          margin: 0;
        }

        .fs-reasons {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .fs-reason {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 24px;
        }

        .fs-reason-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-bottom: 16px;
        }
        .fs-reason-dot.todo { background: var(--lane-todo); }
        .fs-reason-dot.progress { background: var(--lane-progress); }
        .fs-reason-dot.done { background: var(--lane-done); }

        .fs-reason h3 {
          font-family: var(--font-display);
          font-size: 17px;
          margin: 0 0 8px;
        }

        .fs-reason p {
          font-size: 14.5px;
          color: var(--ink-muted);
          margin: 0;
        }

        /* ---------- closing cta ---------- */
        .fs-cta {
          border-top: 1px solid var(--border);
          padding: 56px 0;
        }

        .fs-cta-box {
          background: var(--ink);
          border-radius: 20px;
          padding: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          flex-wrap: wrap;
        }

        .fs-cta-box h2 {
          font-family: var(--font-display);
          color: #fff;
          font-size: clamp(22px, 2.6vw, 30px);
          margin: 0 0 8px;
          letter-spacing: -0.01em;
        }

        .fs-cta-box p {
          color: #B7BCCB;
          margin: 0;
          font-size: 15px;
          max-width: 420px;
        }

        .fs-cta-form {
          display: flex;
          gap: 10px;
          flex: 1;
          min-width: 280px;
          max-width: 420px;
        }

        .fs-cta-form .fs-input {
          background: #1D212C;
          border-color: #2C3140;
          color: #fff;
        }
        .fs-cta-form .fs-input::placeholder { color: #7A8094; }

        /* ---------- footer ---------- */
        .fs-footer {
          border-top: 1px solid var(--border);
          padding: 28px 0;
        }

        .fs-footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .fs-footer-tag {
          font-size: 13px;
          color: var(--ink-muted);
        }

        /* ---------- responsive ---------- */
        @media (max-width: 860px) {
          .fs-hero-grid { grid-template-columns: 1fr; gap: 40px; }
          .fs-reasons { grid-template-columns: 1fr; }
          .fs-board-cols { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 640px) {
          .fs-nav-actions .fs-btn-ghost-desktop { display: none; }
          .fs-nav-toggle { display: inline-flex; }

          .fs-nav-links-mobile {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 0 24px 16px;
          }
          .fs-nav-links-mobile .fs-btn { width: 100%; text-align: center; }

          .fs-hero { padding: 48px 0 44px; }
          .fs-form { flex-direction: column; }
          .fs-form .fs-btn { width: 100%; }

          .fs-board { padding: 14px; }
          .fs-board-cols { grid-template-columns: 1fr; }
          .fs-col { min-height: unset; }
          .fs-card-moving { animation: none; }

          .fs-cta-box { padding: 32px 24px; flex-direction: column; align-items: stretch; }
          .fs-cta-form { flex-direction: column; max-width: none; }
          .fs-cta-form .fs-btn { width: 100%; }

          .fs-footer-inner { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      {/* ---------- nav ---------- */}
      <header className="fs-nav">
        <div className="fs-container fs-nav-inner">
          <div className="fs-logo">
            <span className="fs-logo-mark" aria-hidden="true" />
            FlowSync
          </div>

          <div className="fs-nav-actions">
            <Link to="/login" className="fs-btn fs-btn-ghost fs-btn-ghost-desktop">
  Log in
</Link>

<Link to="/signup" className="fs-btn fs-btn-primary">
  Sign up
</Link>
            <button
              className="fs-nav-toggle"
              aria-label="Toggle menu"
              aria-expanded={navOpen}
              onClick={() => setNavOpen((v) => !v)}
            >
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                <path d="M0 1H18" stroke="#12151C" strokeWidth="1.6" />
                <path d="M0 7H18" stroke="#12151C" strokeWidth="1.6" />
                <path d="M0 13H18" stroke="#12151C" strokeWidth="1.6" />
              </svg>
            </button>
          </div>
        </div>

        {navOpen && (
          <div className="fs-nav-links-mobile">
            <Link to="/login" className="fs-btn fs-btn-ghost">
  Log in
</Link>
          </div>
        )}
      </header>

      {/* ---------- hero ---------- */}
      <section className="fs-hero">
        <div className="fs-container fs-hero-grid">
          <div>
            <span className="fs-eyebrow">
              <span className="fs-eyebrow-dot" aria-hidden="true" />
              Project & work tracking
            </span>

            <h1 className="fs-h1">
              Plan the work.
              <br />
              Track it <em>in one place</em>.
            </h1>

            <p className="fs-sub">
              FlowSync is a shared home for your team's issues, sprints, and roadmaps —
              built for teams who've outgrown scattered docs and spreadsheets, and want
              one board everyone actually keeps up to date.
            </p>

            <form
              id="signup"
              className="fs-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <label htmlFor="fs-email" className="fs-visually-hidden" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
                Email address
              </label>
              <input
                id="fs-email"
                className="fs-input"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (submitState !== "idle") setSubmitState("idle");
                }}
                required
              />
              <button type="submit" className="fs-btn fs-btn-primary">
                Join us
              </button>
            </form>

            {submitState === "success" && (
              <p className="fs-form-msg success" role="status">
                You're on the list — we'll be in touch at {email}.
              </p>
            )}
            {submitState === "error" && (
              <p className="fs-form-msg error" role="alert">
                That email doesn't look right — mind checking it?
              </p>
            )}
            {submitState === "idle" && (
              <p className="fs-form-note">
                Get early access and occasional updates. No spam.
              </p>
            )}
          </div>

          <div className="fs-board" aria-hidden="true">
            <div className="fs-board-header">
              <span className="fs-board-title">Sprint 14 — Onboarding revamp</span>
            </div>
            <div className="fs-board-cols">
              <div className="fs-col">
                <div className="fs-col-label">
                  <span className="fs-col-dot todo" />
                  Backlog
                </div>
                <div className="fs-card">
                  Draft empty-state copy
                  <span className="fs-card-tag">Design</span>
                </div>
                <div className="fs-card">
                  Audit invite flow drop-off
                  <span className="fs-card-tag">Research</span>
                </div>
              </div>

              <div className="fs-col">
                <div className="fs-col-label">
                  <span className="fs-col-dot progress" />
                  In progress
                </div>
                <div className="fs-card fs-card-moving">
                  Rebuild invite screen
                  <span className="fs-card-tag">Frontend</span>
                </div>
                <div className="fs-card">
                  Wire up email verification
                  <span className="fs-card-tag">Backend</span>
                </div>
              </div>

              <div className="fs-col">
                <div className="fs-col-label">
                  <span className="fs-col-dot done" />
                  Done
                </div>
                <div className="fs-card">
                  Set up staging board
                  <span className="fs-card-tag">Platform</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- why join ---------- */}
      <section className="fs-why">
        <div className="fs-container">
          <div className="fs-why-head">
            <h2 className="fs-h2">Why teams are joining FlowSync</h2>
            <p className="fs-why-sub">
              We built FlowSync after watching good teams lose time to tools that
              didn't match how they actually worked. Here's what's different.
            </p>
          </div>

          <div className="fs-reasons">
            {REASONS.map((r) => (
              <div className="fs-reason" key={r.title}>
                <span className={`fs-reason-dot ${r.tone}`} aria-hidden="true" />
                <h3>{r.title}</h3>
                <p>{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- closing cta ---------- */}
      <section className="fs-cta">
        <div className="fs-container">
          <div className="fs-cta-box">
            <div>
              <h2>Bring your team's work into one flow.</h2>
              <p>Join early access and help shape what we build next.</p>
            </div>

            <form className="fs-cta-form" onSubmit={handleSubmit} noValidate>
              <input
                className="fs-input"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (submitState !== "idle") setSubmitState("idle");
                }}
                required
                aria-label="Email address"
              />
              <button type="submit" className="fs-btn fs-btn-primary">
                Join us
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ---------- footer ---------- */}
      <footer className="fs-footer">
        <div className="fs-container fs-footer-inner">
          <div className="fs-logo">
            <span className="fs-logo-mark" aria-hidden="true" />
            FlowSync
          </div>
          <span className="fs-footer-tag">
            © {new Date().getFullYear()} FlowSync. Work, in sync.
          </span>
        </div>
      </footer>
    </div>
  );
}