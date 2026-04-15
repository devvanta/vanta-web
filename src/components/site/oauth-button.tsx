"use client";

type Provider = "google" | "apple";

export function OAuthButton({ provider }: { provider: Provider }) {
  const label = provider === "google" ? "Continuar com Google" : "Continuar com Apple";

  return (
    <button
      type="button"
      className="w-full flex items-center justify-center gap-3 bg-elevated border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-text-primary hover-real:border-white/20 transition-colors duration-200 cursor-pointer active:scale-95"
    >
      <span className="h-5 w-5 flex items-center justify-center shrink-0">
        {provider === "google" ? <GoogleIcon /> : <AppleIcon />}
      </span>
      {label}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path
        fill="#EA4335"
        d="M12 10.2v3.8h5.4c-.2 1.4-1.6 4-5.4 4-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.7 3.4 14.6 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6H12z"
      />
      <path
        fill="#34A853"
        d="M3.9 7.5l3 2.2c.8-2.4 3-4.2 5.6-4.2 1.5 0 2.9.5 4 1.5l2.8-2.7C17.3 2.5 14.8 1.5 12 1.5 7.8 1.5 4.2 3.8 2.4 7.2l1.5.3z"
        opacity="0"
      />
      <path
        fill="#FBBC05"
        d="M12 21.5c2.6 0 4.8-.9 6.4-2.3l-3.1-2.4c-.8.6-2 1-3.3 1-2.6 0-4.8-1.7-5.6-4.1l-3 2.3C4.3 19.2 7.9 21.5 12 21.5z"
      />
      <path
        fill="#4285F4"
        d="M21.4 12c0-.6-.1-1.1-.2-1.6H12v3.8h5.4c-.2 1.1-.9 2.1-1.9 2.8l3.1 2.4c1.8-1.7 2.8-4.1 2.8-7.4z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M17.05 12.04c-.03-3.02 2.47-4.47 2.58-4.54-1.41-2.06-3.6-2.34-4.37-2.37-1.85-.19-3.64 1.1-4.59 1.1-.95 0-2.4-1.08-3.96-1.05-2.03.03-3.92 1.18-4.97 3-2.13 3.68-.54 9.14 1.51 12.14 1.01 1.47 2.21 3.12 3.79 3.06 1.52-.06 2.1-.98 3.94-.98s2.36.98 3.97.95c1.64-.03 2.68-1.49 3.68-2.97 1.17-1.7 1.64-3.36 1.66-3.45-.04-.02-3.18-1.22-3.22-4.84z M14.3 3.5c.83-1 1.39-2.38 1.24-3.75-1.2.05-2.66.8-3.52 1.8-.77.9-1.45 2.34-1.27 3.67 1.35.1 2.71-.68 3.55-1.72z" />
    </svg>
  );
}
