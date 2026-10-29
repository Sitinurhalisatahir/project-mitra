export function IconNetwork({ className = "w-5 h-5 fill-current", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="6" cy="7" r="2" />
      <circle cx="18" cy="7" r="2" />
      <circle cx="6" cy="17" r="2" />
      <circle cx="18" cy="17" r="2" />
      <path
        d="M7.7 8.1l2.8 2.5M16.3 8.1l-2.8 2.5M7.7 15.9l2.8-2.5M16.3 15.9l-2.8-2.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function IconDashboard({ className = "w-4 h-4 shrink-0", ...props }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <rect height="7" rx="1.5" width="7" x="3" y="3" />
      <rect height="7" rx="1.5" width="7" x="14" y="3" />
      <rect height="7" rx="1.5" width="7" x="3" y="14" />
      <rect height="7" rx="1.5" width="7" x="14" y="14" />
    </svg>
  );
}

export function IconShield({ className = "w-4 h-4 shrink-0", ...props }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <path
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconLayers({ className = "w-4 h-4 shrink-0", ...props }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <path d="M12 3L4 9l8 6 8-6-8-6z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 14l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 10l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconTrend({ className = "w-4 h-4 shrink-0", ...props }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconLogout({ className = "w-4 h-4 text-rose-500 group-hover:-translate-x-0.5 transition-transform", ...props }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <path
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconBell({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <path
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconUser({ className = "w-5 h-5 text-white", ...props }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconUsers({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <path
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconFolder({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCheckCircle({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconUsers2({ className = "w-6 h-6", ...props }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function IconClock({ className = "w-6 h-6", ...props }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function IconCheckCircle2({ className = "w-6 h-6", ...props }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export function IconInfo({ className = "w-4 h-4", ...props }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

export function IconShieldCheck({ className = "w-4 h-4", ...props }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

export function IconShieldAlert({ className = "w-5 h-5", ...props }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export function IconCheck({ className = "w-4 h-4", ...props }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function IconChevronLeft({ className = "w-4 h-4", ...props }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function IconChevronRight({ className = "w-4 h-4", ...props }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

