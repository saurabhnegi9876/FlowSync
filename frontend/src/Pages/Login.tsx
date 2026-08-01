import React, { useEffect, useRef, useState } from "react";
import {Link} from  "react-router-dom"
/**
 * FlowSync — Login page
 * Self-contained, responsive React/TypeScript component.
 * Shares the FlowSync design tokens (canvas, ink, accent) with the homepage,
 * but is a distinct, single-card layout suited to a returning-user flow.
 */

type FieldErrors = {
  email?: string;
  password?: string;
};

type AuthResult = { success: boolean; message?: string };

export interface LoginPageProps {
  /** Called when the user submits valid credentials. Defaults to a demo
   *  implementation so the page works standalone without a backend. */
  onSubmit?: (email: string, password: string) => Promise<AuthResult>;
  /** Called when the user clicks the FlowSync logo. */
  onNavigateHome?: () => void;
  /** Called when the user clicks "Sign up". */
  onNavigateToSignup?: () => void;
  /** Called when the user clicks "Forgot password?". */
  onNavigateToForgotPassword?: () => void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_ATTEMPTS = 3;
const LOCKOUT_SECONDS = 30;

async function defaultLoginRequest(email: string, _password: string): Promise<AuthResult> {
  // Demo network delay
  await new Promise((r) => setTimeout(r, 900));
  if (email.trim().toLowerCase() === "test@fail.com") {
    return { success: false, message: "Incorrect email or password." };
  }
  return { success: true };
}

export default function LoginPage({
  onSubmit = defaultLoginRequest,
  onNavigateHome,
  onNavigateToSignup,
  onNavigateToForgotPassword,
}: LoginPageProps): React.JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  const passwordRef = useRef<HTMLInputElement>(null);

  // Countdown for the lockout edge case (too many failed attempts).
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const t = setInterval(() => {
      setLockoutRemaining((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [lockoutRemaining]);

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!email.trim()) {
      errors.email = "Enter your email address.";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      errors.email = "That email address doesn't look valid.";
    }
    if (!password) {
      errors.password = "Enter your password.";
    }
    return errors;
  }

  const errors = validate();
  const isLockedOut = lockoutRemaining > 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setFormError(null);

    if (isLockedOut) return;
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const result = await onSubmit(email.trim(), password);
      if (result.success) {
        setFormError(null);
        setAttempts(0);
        // In a real app this would redirect. Here we just surface success.
        setFormError("__success__");
      } else {
        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);
        if (nextAttempts >= MAX_ATTEMPTS) {
          setLockoutRemaining(LOCKOUT_SECONDS);
          setFormError(
            `Too many failed attempts. Try again in ${LOCKOUT_SECONDS} seconds.`
          );
        } else {
          setFormError(result.message ?? "Something went wrong. Please try again.");
        }
      }
    } catch {
      setFormError("We couldn't reach FlowSync. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fsl-root">
      <style>{`
        .fsl-root {
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

        .fsl-root * { box-sizing: border-box; }
        .fsl-root a { color: inherit; text-decoration: none; }
        .fsl-root button { font-family: inherit; cursor: pointer; }
        .fsl-root :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

        .fsl-topbar {
          padding: 24px;
        }

        .fsl-logo {
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

        .fsl-logo-mark {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          background: linear-gradient(135deg, #9AA1B1 0%, var(--accent) 55%, #17A673 100%);
          flex-shrink: 0;
        }

        .fsl-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .fsl-card {
          width: 100%;
          max-width: 400px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 36px 32px;
          box-shadow: 0 24px 48px -28px rgba(18, 21, 28, 0.16);
        }

        .fsl-h1 {
          font-family: var(--font-display);
          font-size: 26px;
          letter-spacing: -0.01em;
          margin: 0 0 6px;
        }

        .fsl-sub {
          font-size: 14.5px;
          color: var(--ink-muted);
          margin: 0 0 28px;
        }

        .fsl-field {
          margin-bottom: 18px;
        }

        .fsl-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .fsl-input-row {
          position: relative;
        }

        .fsl-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--surface);
          font-size: 14.5px;
          color: var(--ink);
        }
        .fsl-input::placeholder { color: #9099AC; }
        .fsl-input:focus { border-color: var(--accent); }
        .fsl-input[aria-invalid="true"] { border-color: var(--error); }

        .fsl-input.has-toggle { padding-right: 44px; }

        .fsl-toggle-visibility {
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
        .fsl-toggle-visibility:hover { color: var(--accent); }

        .fsl-field-error {
          font-size: 12.5px;
          color: var(--error);
          margin-top: 6px;
        }

        .fsl-hint {
          font-size: 12px;
          color: var(--ink-muted);
          margin-top: 6px;
        }

        .fsl-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
        }

        .fsl-checkbox-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          color: var(--ink-muted);
        }

        .fsl-checkbox-row input { accent-color: var(--accent); width: 15px; height: 15px; }

        .fsl-link {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--accent);
        }
        .fsl-link:hover { color: var(--accent-hover); }

        .fsl-submit {
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
        .fsl-submit:hover:not(:disabled) { background: var(--accent-hover); }
        .fsl-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .fsl-banner {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13.5px;
          padding: 12px 14px;
          border-radius: 8px;
          margin-bottom: 18px;
        }
        .fsl-banner.error { background: var(--error-soft); color: var(--error); }
        .fsl-banner.success { background: #E6F6EF; color: var(--success); }

        .fsl-footer-row {
          text-align: center;
          margin-top: 24px;
          font-size: 13.5px;
          color: var(--ink-muted);
        }

        @media (max-width: 480px) {
          .fsl-card { padding: 28px 22px; border-radius: 12px; }
        }
      `}</style>

      <div className="fsl-topbar">
        <button className="fsl-logo" onClick={onNavigateHome} type="button">
          <span className="fsl-logo-mark" aria-hidden="true" />
          FlowSync
        </button>
      </div>

      <div className="fsl-wrap">
        <div className="fsl-card">
          <h1 className="fsl-h1">Welcome back</h1>
          <p className="fsl-sub">Log in to pick up where your team left off.</p>

          {formError === "__success__" && (
            <div className="fsl-banner success" role="status">
              You're logged in. Redirecting to your boards…
            </div>
          )}
          {formError && formError !== "__success__" && (
            <div className="fsl-banner error" role="alert">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="fsl-field">
              <label className="fsl-label" htmlFor="fsl-email">
                Email
              </label>
              <div className="fsl-input-row">
                <input
                  id="fsl-email"
                  className="fsl-input"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  disabled={submitting || isLockedOut}
                  aria-invalid={Boolean(touched.email && errors.email)}
                  aria-describedby="fsl-email-error"
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                />
              </div>
              {touched.email && errors.email && (
                <p className="fsl-field-error" id="fsl-email-error">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="fsl-field">
              <label className="fsl-label" htmlFor="fsl-password">
                Password
              </label>
              <div className="fsl-input-row">
                <input
                  id="fsl-password"
                  ref={passwordRef}
                  className="fsl-input has-toggle"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  disabled={submitting || isLockedOut}
                  aria-invalid={Boolean(touched.password && errors.password)}
                  aria-describedby="fsl-password-error"
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  onKeyUp={(e) => setCapsLockOn(e.getModifierState?.("CapsLock") ?? false)}
                />
                <button
                  type="button"
                  className="fsl-toggle-visibility"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="fsl-field-error" id="fsl-password-error">
                  {errors.password}
                </p>
              )}
              {capsLockOn && !errors.password && (
                <p className="fsl-hint">Caps Lock is on.</p>
              )}
            </div>

            <div className="fsl-row">
              <label className="fsl-checkbox-row">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <a
                href="#forgot-password"
                className="fsl-link"
                onClick={(e) => {
                  if (onNavigateToForgotPassword) {
                    e.preventDefault();
                    onNavigateToForgotPassword();
                  }
                }}
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="fsl-submit"
              disabled={submitting || isLockedOut}
            >
              {isLockedOut
                ? `Try again in ${lockoutRemaining}s`
                : submitting
                ? "Logging in…"
                : "Log in"}
            </button>
          </form>

<p className="fsl-footer-row">
  New to FlowSync?{" "}
  <Link to="/signup" className="fsl-link">
    Sign up
  </Link>
</p>
        </div>
      </div>
    </div>
  );
}