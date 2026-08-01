import React, { useMemo, useState } from "react";
import {Link} from "react-router-dom"
/**
 * FlowSync — Signup page
 * Self-contained, responsive React/TypeScript component.
 * Shares the FlowSync design tokens (canvas, ink, accent) with the homepage
 * and login page, but uses a distinct split layout with a benefits panel —
 * appropriate for a first-time-visitor conversion flow.
 */

type FieldErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
};

type SignupResult = { success: boolean; message?: string };

export interface SignupPageProps {
  /** Called when the user submits a fully valid form. Defaults to a demo
   *  implementation so the page works standalone without a backend. */
  onSubmit?: (data: {
    fullName: string;
    email: string;
    password: string;
  }) => Promise<SignupResult>;
  onNavigateHome?: () => void;
  onNavigateToLogin?: () => void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BENEFITS = [
  { tone: "todo", text: "One shared board for backlog, sprint, and roadmap" },
  { tone: "progress", text: "Issues and subtasks that follow your team's real process" },
  { tone: "done", text: "Comments and decisions kept right on the card" },
] as const;

async function defaultSignupRequest(data: {
  fullName: string;
  email: string;
  password: string;
}): Promise<SignupResult> {
  await new Promise((r) => setTimeout(r, 900));
  if (data.email.trim().toLowerCase() === "taken@flowsync.io") {
    return { success: false, message: "An account with this email already exists." };
  }
  return { success: true };
}

function getPasswordStrength(password: string): {
  score: 0 | 1 | 2 | 3;
  label: string;
  tone: "todo" | "progress" | "done";
} {
  if (!password) return { score: 0, label: "", tone: "todo" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: "Weak", tone: "todo" };
  if (score === 2) return { score: 2, label: "Fair", tone: "progress" };
  return { score: 3, label: "Strong", tone: "done" };
}

export default function SignupPage({
  onSubmit = defaultSignupRequest,
  onNavigateHome,
  onNavigateToLogin,
}: SignupPageProps): React.JSX.Element {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<Record<keyof FieldErrors, boolean>>({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
    terms: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!fullName.trim()) {
      errors.fullName = "Enter your full name.";
    }
    if (!email.trim()) {
      errors.email = "Enter your email.";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      errors.email = "That email address doesn't look valid.";
    }
    if (!password) {
      errors.password = "Create a password.";
    } else if (password.length < 8) {
      errors.password = "Use at least 8 characters.";
    } else if (!/\d/.test(password)) {
      errors.password = "Include at least one number.";
    } else if (!/[A-Z]/.test(password)) {
      errors.password = "Include at least one uppercase letter.";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Confirm your password.";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords don't match.";
    }
    if (!agreeTerms) {
      errors.terms = "You need to accept the terms to continue.";
    }
    return errors;
  }

  const errors = validate();

  function markAllTouched(): void {
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      terms: true,
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    markAllTouched();
    setFormError(null);

    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const result = await onSubmit({ fullName: fullName.trim(), email: email.trim(), password });
      if (result.success) {
        setSubmitted(true);
      } else {
        setFormError(result.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setFormError("We couldn't reach FlowSync. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fss-root">
      <style>{`
        .fss-root {
          --canvas: #F1F3F7;
          --surface: #FFFFFF;
          --ink: #12151C;
          --ink-muted: #565D6D;
          --border: #E1E4EA;
          --accent: #4B3DF2;
          --accent-hover: #3C2FE0;
          --accent-soft: #E9E6FD;
          --error: #C4432B;
          --error-soft: #FBEAE6;
          --success: #17A673;
          --lane-todo: #9AA1B1;
          --lane-progress: #4B3DF2;
          --lane-done: #17A673;

          --font-display: "Space Grotesk", "Segoe UI", system-ui, sans-serif;
          --font-body: "Inter", "Segoe UI", system-ui, sans-serif;

          min-height: 100vh;
          background: var(--canvas);
          color: var(--ink);
          font-family: var(--font-body);
          -webkit-font-smoothing: antialiased;
          display: flex;
          flex-direction: column;
        }

        .fss-root * { box-sizing: border-box; }
        .fss-root a { color: inherit; text-decoration: none; }
        .fss-root button { font-family: inherit; cursor: pointer; }
        .fss-root :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

        .fss-topbar { padding: 24px; }

        .fss-logo {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 19px;
          letter-spacing: -0.01em;
          background: transparent;
          border: none;
          padding: 0;
        }

        .fss-logo-mark {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          background: linear-gradient(135deg, var(--lane-todo) 0%, var(--accent) 55%, var(--lane-done) 100%);
          flex-shrink: 0;
        }

        .fss-wrap {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 1100px;
          width: 100%;
          margin: 0 auto;
          gap: 48px;
          align-items: center;
          padding: 24px;
        }

        .fss-form-col {
          display: flex;
          justify-content: center;
        }

        .fss-card {
          width: 100%;
          max-width: 420px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 36px 32px;
          box-shadow: 0 24px 48px -28px rgba(18, 21, 28, 0.16);
        }

        .fss-h1 {
          font-family: var(--font-display);
          font-size: 26px;
          letter-spacing: -0.01em;
          margin: 0 0 6px;
        }

        .fss-sub {
          font-size: 14.5px;
          color: var(--ink-muted);
          margin: 0 0 26px;
        }

        .fss-field { margin-bottom: 16px; }

        .fss-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .fss-input-row { position: relative; }

        .fss-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--surface);
          font-size: 14.5px;
          color: var(--ink);
        }
        .fss-input::placeholder { color: #9099AC; }
        .fss-input:focus { border-color: var(--accent); }
        .fss-input[aria-invalid="true"] { border-color: var(--error); }
        .fss-input.has-toggle { padding-right: 44px; }

        .fss-toggle-visibility {
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          padding: 6px 8px;
          font-size: 12px;
          font-weight: 600;
          color: var(--ink-muted);
          border-radius: 6px;
        }
        .fss-toggle-visibility:hover { color: var(--accent); }

        .fss-field-error {
          font-size: 12.5px;
          color: var(--error);
          margin-top: 6px;
        }

        .fss-strength {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
        }

        .fss-strength-bars {
          display: flex;
          gap: 4px;
          flex: 1;
        }

        .fss-strength-bar {
          height: 4px;
          flex: 1;
          border-radius: 2px;
          background: var(--border);
        }
        .fss-strength-bar.filled.todo { background: var(--lane-todo); }
        .fss-strength-bar.filled.progress { background: var(--lane-progress); }
        .fss-strength-bar.filled.done { background: var(--lane-done); }

        .fss-strength-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--ink-muted);
          min-width: 40px;
          text-align: right;
        }

        .fss-terms-row {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin: 18px 0;
          font-size: 13px;
          color: var(--ink-muted);
        }
        .fss-terms-row input { accent-color: var(--accent); width: 15px; height: 15px; margin-top: 2px; flex-shrink: 0; }

        .fss-submit {
          width: 100%;
          padding: 12px 16px;
          border-radius: 8px;
          border: none;
          background: var(--accent);
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          transition: background 0.15s ease, opacity 0.15s ease;
        }
        .fss-submit:hover:not(:disabled) { background: var(--accent-hover); }
        .fss-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .fss-banner {
          font-size: 13.5px;
          padding: 12px 14px;
          border-radius: 8px;
          margin-bottom: 18px;
          background: var(--error-soft);
          color: var(--error);
        }

        .fss-footer-row {
          text-align: center;
          margin-top: 22px;
          font-size: 13.5px;
          color: var(--ink-muted);
        }

        .fss-link { font-size: inherit; font-weight: 600; color: var(--accent); }
        .fss-link:hover { color: var(--accent-hover); }

        /* success state */
        .fss-success {
          text-align: center;
          padding: 12px 0 4px;
        }
        .fss-success-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #E6F6EF;
          color: var(--success);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
          font-size: 22px;
        }
        .fss-success h2 {
          font-family: var(--font-display);
          font-size: 22px;
          margin: 0 0 8px;
        }
        .fss-success p {
          font-size: 14px;
          color: var(--ink-muted);
          margin: 0;
        }

        /* right benefits panel */
        .fss-panel {
          background: var(--ink);
          border-radius: 20px;
          padding: 44px;
          color: #fff;
        }

        .fss-panel-eyebrow {
          font-size: 13px;
          font-weight: 600;
          color: #B7BCCB;
          margin: 0 0 12px;
        }

        .fss-panel h2 {
          font-family: var(--font-display);
          font-size: 26px;
          line-height: 1.15;
          letter-spacing: -0.01em;
          margin: 0 0 28px;
        }

        .fss-benefit {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 20px;
        }

        .fss-benefit-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          margin-top: 6px;
          flex-shrink: 0;
        }
        .fss-benefit-dot.todo { background: var(--lane-todo); }
        .fss-benefit-dot.progress { background: var(--lane-progress); }
        .fss-benefit-dot.done { background: var(--lane-done); }

        .fss-benefit p {
          margin: 0;
          font-size: 14.5px;
          color: #D7DAE3;
          line-height: 1.5;
        }

        @media (max-width: 900px) {
          .fss-wrap { grid-template-columns: 1fr; gap: 28px; }
          .fss-panel { order: 2; padding: 32px; }
          .fss-form-col { order: 1; }
        }

        @media (max-width: 480px) {
          .fss-card, .fss-panel { padding: 26px 22px; border-radius: 12px; }
        }
      `}</style>

      <div className="fss-topbar">
        <button className="fss-logo" onClick={onNavigateHome} type="button">
          <span className="fss-logo-mark" aria-hidden="true" />
          FlowSync
        </button>
      </div>

      <div className="fss-wrap">
        <div className="fss-form-col">
          <div className="fss-card">
            {submitted ? (
              <div className="fss-success" role="status">
                <div className="fss-success-icon" aria-hidden="true">✓</div>
                <h2>Check your inbox</h2>
                <p>
                  We sent a confirmation link to <strong>{email}</strong>. Verify your
                  address to finish setting up your FlowSync account.
                </p>
              </div>
            ) : (
              <>
                <h1 className="fss-h1">Create your account</h1>
                <p className="fss-sub">Set up FlowSync for your team in a couple of minutes.</p>

                {formError && (
                  <div className="fss-banner" role="alert">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="fss-field">
                    <label className="fss-label" htmlFor="fss-name">
                      Full name
                    </label>
                    <input
                      id="fss-name"
                      className="fss-input"
                      type="text"
                      autoComplete="name"
                      placeholder="Jordan Blake"
                      value={fullName}
                      disabled={submitting}
                      aria-invalid={Boolean(touched.fullName && errors.fullName)}
                      aria-describedby="fss-name-error"
                      onChange={(e) => setFullName(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
                    />
                    {touched.fullName && errors.fullName && (
                      <p className="fss-field-error" id="fss-name-error">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="fss-field">
                    <label className="fss-label" htmlFor="fss-email">
                      Email
                    </label>
                    <input
                      id="fss-email"
                      className="fss-input"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={email}
                      disabled={submitting}
                      aria-invalid={Boolean(touched.email && errors.email)}
                      aria-describedby="fss-email-error"
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    />
                    {touched.email && errors.email && (
                      <p className="fss-field-error" id="fss-email-error">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="fss-field">
                    <label className="fss-label" htmlFor="fss-password">
                      Password
                    </label>
                    <div className="fss-input-row">
                      <input
                        id="fss-password"
                        className="fss-input has-toggle"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
                        value={password}
                        disabled={submitting}
                        aria-invalid={Boolean(touched.password && errors.password)}
                        aria-describedby="fss-password-error"
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                      />
                      <button
                        type="button"
                        className="fss-toggle-visibility"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {password && (
                      <div className="fss-strength" aria-hidden="true">
                        <div className="fss-strength-bars">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className={`fss-strength-bar ${
                                i < strength.score ? `filled ${strength.tone}` : ""
                              }`}
                            />
                          ))}
                        </div>
                        <span className="fss-strength-label">{strength.label}</span>
                      </div>
                    )}
                    {touched.password && errors.password && (
                      <p className="fss-field-error" id="fss-password-error">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="fss-field">
                    <label className="fss-label" htmlFor="fss-confirm-password">
                      Confirm password
                    </label>
                    <div className="fss-input-row">
                      <input
                        id="fss-confirm-password"
                        className="fss-input has-toggle"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        disabled={submitting}
                        aria-invalid={Boolean(touched.confirmPassword && errors.confirmPassword)}
                        aria-describedby="fss-confirm-password-error"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
                      />
                      <button
                        type="button"
                        className="fss-toggle-visibility"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <p className="fss-field-error" id="fss-confirm-password-error">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div className="fss-terms-row">
                    <input
                      id="fss-terms"
                      type="checkbox"
                      checked={agreeTerms}
                      disabled={submitting}
                      onChange={(e) => {
                        setAgreeTerms(e.target.checked);
                        setTouched((t) => ({ ...t, terms: true }));
                      }}
                    />
                    <label htmlFor="fss-terms">
                      I agree to FlowSync's Terms of Service and Privacy Policy.
                    </label>
                  </div>
                  {touched.terms && errors.terms && (
                    <p className="fss-field-error" style={{ marginTop: -10, marginBottom: 14 }}>
                      {errors.terms}
                    </p>
                  )}

                  <button type="submit" className="fss-submit" disabled={submitting}>
                    {submitting ? "Creating account…" : "Create account"}
                  </button>
                </form>

                <p className="fss-footer-row">
  Already have an account?{" "}
  <Link to="/login" className="fss-link">
    Log in
  </Link>
</p>
              </>
            )}
          </div>
        </div>

        <div className="fss-panel">
          <p className="fss-panel-eyebrow">Why teams join FlowSync</p>
          <h2>Everything your team ships, in one shared flow.</h2>
          {BENEFITS.map((b) => (
            <div className="fss-benefit" key={b.text}>
              <span className={`fss-benefit-dot ${b.tone}`} aria-hidden="true" />
              <p>{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}